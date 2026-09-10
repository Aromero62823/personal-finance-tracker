from django.urls import path
from . import views

urlpatterns = [
    path(route="", view=views.loginView, name='login_view'),
    path(route="register/", view=views.registerView, name='register_view'),
    path(route='home/', view=views.homepage, name='home'),
    path(route='logout/', view=views.logoutView, name='logout'),
    path(route='home/transactions/', view=views.transactionView, name='transactions'),
    path(route='home/history/', view=views.historyView, name='history')
]