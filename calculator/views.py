# return
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, HttpRequest
from django.urls import reverse
from django.contrib import messages
# decorators
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
# models
from .models import Household, Item, Member, Total
from django.contrib.auth.models import User

# my functions
from .functions import Paginator, update_user_total, list_has_duplicates

# json
from django.http import JsonResponse
import json

# login
from django.contrib.auth import authenticate, login, logout

# other
from django.db import IntegrityError



@login_required
def transactions(request):
    """ main page where users can add/edit/read/delete transactions """
    user = request.user
    house = Household.objects.filter(owner=user).first()
    message = ''
    if not house:
        """ if user has not created a household redirect them to the page to do so """
        return HttpResponseRedirect(reverse("getting_started"))

    """ query database for household transaction info """
    unsettled = Item.objects.filter(household=house, squared=False, hidden=False).order_by("-created").all()
    settled = Item.objects.filter(household=house, squared=True, hidden=False).order_by("-created").all()
    # calculate how to settle debts
    settlements = calculator(house)

    if request.method == 'PUT':
        """ loads info to transaction table asynchronously using pagination """
        data = json.loads(request.body)
        page = int(data.get('page'))
        request_table = data.get('settled')
        table = settled if request_table == True else unsettled
        return JsonResponse(paginate(table, page))
 
    if request.method == 'POST':
        """ check item valid """
        # checks member is given
        try:
            member_pk = request.POST["member"]
        except KeyError as e:
            print(f'KeyError: {e}')
            return HttpResponse('A member must be given.', status=400)
        #checks member is valid
        if not Member.objects.filter(pk=member_pk).first():
            return HttpResponse('A valid member must be given.', status=400)
        # makes sure title is given    
        item = request.POST["item"]
        if item == '':
            messages.error(request, f'Error: Description must be given.')
            return HttpResponseRedirect(reverse('transactions'))
        # checks for positive int
        cost = request.POST["cost"]
        if float(cost) <= 0:
            messages.error(request, f'Error: Cost must be greater than 0')
            return HttpResponseRedirect(reverse('transactions'))

        # save transaction
        member = Member.objects.filter(pk=member_pk).first()
        new_item = Item(member=member, item=item, cost=cost, household=house)
        new_item.save()
        message = 'Transaction added successfuly.'
        # recalculate how to settle debts now transaction is added
        #POST
        settlements = calculator(house)
        return render(request, 'calculator/transactions.html', {'house': house, 'unsettled': paginate(unsettled, 1), 'success_message': message, 'settlements': settlements})
    #GET (both post and get are sent to paginator)
    return render(request, 'calculator/transactions.html', {'house': house, 'unsettled': paginate(unsettled, 1), 'settlements': settlements})


@login_required
def delete_item(request, pk):
    """ renders page for confirming deletion and deletes item """
    user = request.user
    house = Household.objects.filter(owner=user).first()
    item = Item.objects.filter(pk=pk).first()
    if item.household != house:
        return HttpResponse('Forbiden', status=401)
    if request.method == 'POST':
        confirm = request.POST['confirm']
        if confirm:
            item = Item.objects.filter(pk=pk).first()
            item.delete()
            messages.success(request, 'Item successfully deleted.')
            return HttpResponseRedirect(reverse('transactions'))
    return render(request, 'calculator/delete.html', {'item': item})
        

@login_required
def item(request, pk):
    """ edits item and updates users total tally """
    #check user is author
    user = request.user
    house = Household.objects.filter(owner=user).first()
    item = Item.objects.filter(pk=pk).first()
    if item.household != house:
        return HttpResponse('Forbiden', status=401)

    
    if request.method == 'POST':
        name = request.POST["item"]
        
        if name == '':
            messages.error(request, f'Failed to edit {item.item}. Description must be given.')
            return HttpResponseRedirect(reverse('transactions'))
        cost = request.POST["cost"]
        if float(cost) <= 0:
            messages.error(request, f'Failed to edit {item.item}. Cost must be greater than 0')
            return HttpResponseRedirect(reverse('transactions'))
        
        #updates item with new info
        item.item = name
        item.cost = cost
        item.save()

        #recalculates the users running total
        update_user_total(item.member)
        messages.success(request, 'Item successfully edited.')
        return HttpResponseRedirect(reverse('transactions'))
    # GET return
    return render(request, "calculator/item.html", {'item': item})


def index(request):
    return render(request, 'calculator/index.html')


@login_required
def household(request):
    user = request.user
    house = Household.objects.filter(owner=user).first()
    if request.method == 'POST':
        current_house_object = Household.objects.filter(owner=user).first()
        current_members_object = Member.objects.filter(group=current_house_object)
        house_name = request.POST['house']
        if house_name == '':
            message = 'House name required'
            return render(request, 'calculator/household.html', {'house': house, 'message': message})
        # check house name either hasn't changed or isn't already taken
        if Household.objects.filter(name=house_name).first() and current_house_object.name != house_name:
            message = f'{house_name} already taken'
            return render(request, 'calculator/household.html', {'house': house, 'message': message})           

        #creates lowercase list of current members of house from database query
        current_members = []
        for member in current_members_object:
            current_members.append(member.username.lower())

        # take members from form and put in list
        new_members = []
        for i in range(0, 4): # SHOULDN'T HARD CODE 4
            if request.POST[f'add_member{i + 1}']:
                member_post = request.POST[f'add_member{i + 1}']

                # check member not already in database, case insensitive
                if member_post.lower() in current_members:
                    message = f'name {member_post} already taken'
                    return render(request, 'calculator/household.html', {'house': house, 'message': message})
                   
                new_members.append(member_post)
        # Check new members have unique names
        if list_has_duplicates(new_members):
            message = 'Error: No two members can share the same name'
            return render(request, 'calculator/household.html', {'house': house, 'message': message})
        #list of old members from form database
        old_members = []
        for i in range(0, current_house_object.member.count()):
            if request.POST[f'rm_member{i + 1}']:
                old_members.append(request.POST[f'rm_member{i + 1}'])

        proposed_member_total = len(old_members) + len(new_members)
        if proposed_member_total < 2:
            message = 'Minimum of two members required.'
            return render(request, 'calculator/household.html', {'house': house, 'message': message})
        elif proposed_member_total > 6:
            message = 'Maximum of six members per household.'
            return render(request, 'calculator/household.html', {'house': house, 'message': message})

        
        # Removes members
        for member in current_members_object:
            if member.username not in old_members:
                member.delete()

        for member in new_members:
            # create new member and add to house 
            new_mem = Member.objects.create(username=member)
            current_house_object.member.add(new_mem)
            current_house_object.save()


        # save house name
        current_house_object.name = house_name
        current_house_object.save()
        messages.success(request, 'Household successfully updated.')
        return HttpResponseRedirect(reverse('household'))
        
    # GET METHOD
    else:
        return render(request, 'calculator/household.html', {'house': house})


@login_required
def getting_started(request):
    """ a form for new accounts allows creation of household """
    user = request.user
    house = Household.objects.filter(owner=user).first()
    if house:
        return HttpResponseRedirect(reverse('household'))
    if request.method == 'POST':
        house_name = request.POST['house']
        if house_name == '':
            message = 'House name required'
            return render(request, 'calculator/getting_started.html', {'house': house, 'message': message})
        # check name is not taken
        if Household.objects.filter(name=house_name).first():
            message = f'{house_name} already taken, please try another name.'
            return render(request, 'calculator/getting_started.html', {'house': house, 'message': message})
        else:
            # check for at least one member
            if request.POST['member1'] == '' or request.POST['member2'] == '':
                message = 'Household requires at least two members'
                return render(request, 'calculator/getting_started.html', {'house': house, 'message': message})
            # put all members from form into a list
            members = []
           
            #!
            for i in range(0, 6):
                if request.POST[f'member{i + 1}']:
                    members.append(request.POST[f'member{i + 1}'])

            # Check members have unique names
            if list_has_duplicates(members):
                message = 'Error: No two members can share the same name'
                return render(request, 'calculator/getting_started.html', {'house': house, 'message': message})


            # if all conditions have passed, create house
            new_house_object = Household.objects.create(name=house_name, owner=user)
            
            for member in members:

                new_user = Member.objects.create(username=member) #(no objects to work with)
                new_house_object.member.add(new_user)
                new_house_object.save()

            success_message = 'Household created!'
            house = Household.objects.filter(owner=user).first()
            return render(request, 'calculator/transactions.html', {'house': house, 'success_message': success_message})
    # GET METHOD
    else:
        return render(request, 'calculator/getting_started.html', {'house': house})


@login_required
def squared(request):
    user = request.user
    house = Household.objects.filter(owner=user).first()
    
    # calculates how to settle debts
    settlements = calculator(house)

    if request.method == 'POST':
        for setllement in settlements:
            #creates an item for the amount owed to member. reduces senders debt
            Item.objects.create(member=Member.objects.filter(username=setllement['sender'], group=house).first(), 
                household=house, cost=setllement['amount'], 
                item=f"Paid to {setllement['recipient'].capitalize()}", transfer=True)
            
            #creates an item for amount paid as a negative integer to reduce recipient balance
            Item.objects.create(member=Member.objects.filter(username=setllement['recipient'], group=house).first(), 
                household=house, cost=setllement['amount'] * -1, 
                item=f"Credit from {setllement['sender'].capitalize()}", hidden=True, transfer=True)
                    
            
        # set all current items in houshold to settled
        items = Item.objects.filter(household=house).all()
        for item in items:
            item.squared = True
            item.save()
        
        members = Member.objects.filter(group=house).all()
        for member in members:
            update_user_total(member)

        messages.success(request, 'Success! All debts have been settled.')
        return HttpResponseRedirect(reverse('transactions'))
    else:
        return HttpResponse('Post requests only', status=404)
    #return render(request, 'calculator/get_squared.html', {'house': house, 'settlements': settlements})


def calculator(house):

    """ sorts members into lists of over paid, underpaid or square """
    overpaid = []
    underpaid = []
    for member in house.member.all():
        if member.total.balance() < 0:
            underpaid.append({'name': member.username, 'overdrawn': member.total.balance() * -1})
        elif member.total.balance() > 0:
            overpaid.append({'name': member.username, 'balance': member.total.balance()})

    settlements = []
    """settles debts"""
    for i in range(0, len(overpaid)): # iterate through overpaid
        for c in range(0, len(underpaid)):
            tmp = {}
            # try to distribut whole debt to one person
            if overpaid[i]['balance'] >= underpaid[c]['overdrawn'] and underpaid[c]['overdrawn'] > 0:
                tmp['sender'] = underpaid[c]['name']
                tmp['recipient'] = overpaid[i]['name']
                tmp['amount'] = underpaid[c]['overdrawn']
                settlements.append(tmp)
                new = overpaid[i]['balance'] - underpaid[c]['overdrawn']
                overpaid[i]['balance'] = new
                underpaid[c]['overdrawn'] = 0  
            # else pay part of debt to person    
            else:
                if overpaid[i]['balance'] < underpaid[c]['overdrawn'] and overpaid[i]['balance'] > 0:
                    tmp['sender'] = underpaid[c]['name']
                    tmp['recipient'] = overpaid[i]['name']
                    tmp['amount'] = overpaid[i]['balance']
                    settlements.append(tmp)
                    new = underpaid[c]['overdrawn'] - overpaid[i]['balance']
                    overpaid[i]['balance'] = 0
                    underpaid[c]['overdrawn'] = new  
    return settlements


def paginate(table, page):
    num_entries_per_page = 5
    paginator = Paginator(table, num_entries_per_page)
    return(paginator.get_page(page))







#######################
#######ACCOUNTS########
#######################

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            # if existing member, go to transactions page
            if Household.objects.filter(owner=user.pk).first():
                return HttpResponseRedirect(reverse("transactions"))
            # if new member go to homepage instructions
            else:
                return HttpResponseRedirect(reverse("index"))
        # if login fails return to form with error message
        else:
            return render(request, "calculator/login.html", {
                "message": "Invalid email address and/or password."
            })
    else:
        return render(request, "calculator/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["email"]
        if username == "":
            return render(request, "calculator/register.html", {
                "message": "An email addresss must be given."
            })

        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "calculator/register.html", {
                "message": "Passwords must match."
            })
        if password == '':
            return render(request, "calculator/register.html", {
                "message": "You must enter a password."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "calculator/register.html", {
                "message": "Email already in use."
            })
        except ValueError:
            return render(request, "calculator/register.html", {
                "message": "An email addresss must be given."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("getting_started"))
    else:
        return render(request, "calculator/register.html")