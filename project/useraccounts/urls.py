from django.urls import path
from . import views

urlpatterns = [
    path(route="", view=views.login_view, name='login_view'),
    path(route="register/", view=views.register_view, name='register_view'),
    path(route='home/', view=views.home_page, name='home'),
    path(route='logout/', view=views.log_out, name='logout'),
    path(route='home/transactions/', view=views.transaction_view, name='transactions'),
    path(route='home/history/', view=views.history_view, name='history')
]