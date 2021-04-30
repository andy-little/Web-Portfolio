from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Item, Household, Total, Member
from django.contrib.auth.models import User

# when a member is created, create a corrosponding total model (default set to £0)
@receiver(post_save, sender=Member)
def create_total(sender, instance, created, **kwargs):
    if created:
        Total.objects.create(user=instance)

# when item is created 
@receiver(post_save, sender=Item)
def trigger_create(sender, instance, created, **kwargs):
    if created:
        update_total(sender, instance)
    #if edited goes here

# when item is deleted
@receiver(post_delete, sender=Item)
def trigger_delete(sender, instance, **kwargs):
        update_total(sender, instance)


def update_total(sender, instance):
    user = instance.member
    total_model = Total.objects.filter(user=user).first()
    if total_model != None:
        items = Item.objects.filter(member=user, household=instance.household, squared=False).all() #squared?
        total = 0
        for item in items:
            total += item.cost
        # update the user's total
        total_model.total_cost = total
        total_model.save()
    else:
        print('update_total() in signals could not run')

