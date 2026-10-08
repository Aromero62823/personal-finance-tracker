from django.urls import path
from . import api_views

urlpatterns = [
    path(route='totalIncome/', view=api_views.total_income, name='totalIncome'),
    path(route='totalExpense/', view=api_views.total_expense, name='totalExpense'),
    path(route='subWeights/', view=api_views.sub_weights, name='subWeights'),
    path(route='fetchMonthData/', view=api_views.filter_by_month, name='filterMonthData')
]