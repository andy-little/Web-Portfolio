from django.contrib.auth.models import User
from django.db import models

class Member(models.Model):
    username = models.CharField(max_length=64, unique=False)
    def __str__(self):
        return f'{self.username}'


class Total(models.Model):
    user = models.OneToOneField(Member, on_delete=models.CASCADE, related_name="total")
    total_cost = models.DecimalField(max_digits=8, default=0, decimal_places=2)

    def balance(self):
        house = Household.objects.filter(member=self.user).first()
        if house:
            return self.total_cost - house.average()
        else:
            return f"Balance method requires household to be set"
        

    def __str__(self):
        return f'{self.user}: {self.total_cost}'

class Household(models.Model):
    name = models.CharField(max_length=64, unique=True)
    member = models.ManyToManyField(Member, related_name='group')
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='house')

    def average(self):
        total_members = len(self.member.all())
        all_transactions = Item.objects.filter(household=self, squared=False).all()
        house_total_outgoing = 0
        if all_transactions:
            for transaction in all_transactions:
                house_total_outgoing += transaction.cost
            return round(house_total_outgoing / total_members, 2)
        else:
            return 0

    def __str__(self):
        return self.name
        

class Item(models.Model):
    item = models.CharField(max_length=32)
    cost = models.DecimalField(max_digits=8, default=0, decimal_places=2)
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name="items") # on_delete refers to what happens if the user gets deleted (the foreign key, not the current field)
    household = models.ForeignKey(Household, on_delete=models.CASCADE, related_name='items') 
    created = models.DateTimeField(auto_now_add=True)
    squared = models.BooleanField(default=False)
    hidden = models.BooleanField(default=False)
    transfer = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.item} - {self.household}'
