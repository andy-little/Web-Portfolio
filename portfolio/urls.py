from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
]

""" path('project/<int:project>', views.project, name="project"), """
