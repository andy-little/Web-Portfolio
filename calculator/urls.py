from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('household/', views.household, name='household'),
    path('gettingstarted/', views.getting_started, name='getting_started'),
    path('transactions/', views.transactions, name='transactions'),
    path('getsquared/', views.squared, name='get_squared'),
    path('item/<int:pk>', views.item, name='item'),
    path('delete/<int:pk>', views.delete_item, name='delete'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout')
]
