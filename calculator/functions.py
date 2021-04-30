from math import ceil
from .models import Household, Item, Member, Total


class Paginator:
    
    def __init__(self, data, per_page=1):
        self.data = data
        self.per_page = per_page

    def length(self):
        # returns length of data
        return self.data.count()
    def num_pages(self):
        #returns how many pages of data there are
        return ceil(self.data.count() / self.per_page)

    def format_data(self):
        # turns django query set into list of dictionaries
        all_data = []
        for entry in self.data:
            description = entry.item
            amount = f'£{entry.cost}'
            member = entry.member.username
            date = entry.created.strftime("%d/%m/%y")
            pk = entry.pk
            obj = {'item': description, 'cost': amount, 'member': member, 'created': date, 'pk': pk}
            all_data.append(obj)
        return all_data

    def get_page(self, page):
        # returns the only data for given page
        start = self.per_page * (page - 1) # index of first item (zero indexed)
        end = self.per_page * page # should be -1 for actual index but python splice end is non inclusive
        if end > self.length():
            end = self.length()

        # defines info needed for paginator
        has_previous = True if page > 1 else False
        has_next = True if self.num_pages() > page else False
        previous_page_number = page - 1 if page - 1 > 0 else self.num_pages()
        next_page_number = page + 1 if page + 1 < self.num_pages() else 1
        
        
        #### needs more erro handling eg what is end < start
        return {'transactions': self.format_data()[start:end], 'has_previous': has_previous, 'has_next': has_next, 'previous_page_number': previous_page_number, 'next_page_number': next_page_number, 'number': page, 'num_pages': self.num_pages()}


def update_user_total(user):
    user = user
    items = Item.objects.filter(member=user, squared=False).all() #squared?
    total = 0
    # calculate the total cost of any items that haven't been settled
    for item in items:
        total += item.cost
    # update the user's running total
    total_model = Total.objects.filter(user=user).first()
    total_model.total_cost = total
    total_model.save()

def list_has_duplicates(a_list):
    """ checks there are no duplicates in a list """
    a_set = set()
    for item in a_list:
        a_set.add(item.lower())
    
    if len(a_set) != len(a_list):
        return True
    else:
        return False
