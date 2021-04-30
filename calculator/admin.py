from django.contrib import admin
from .models import Household, Item, Total, Member

# Register your models here.
admin.site.register(Household)
admin.site.register(Item)
admin.site.register(Total)
admin.site.register(Member)
