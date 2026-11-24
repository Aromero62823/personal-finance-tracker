from django.urls import path
from . import api_views

urlpatterns = [
    path(route='totalIncome/', view=api_views.total_income, name='totalIncome'),
    path(route='totalExpense/', view=api_views.total_expense, name='totalExpense'),
    path(route='subWeights/', view=api_views.sub_weights, name='subWeights'),
    path(route='fetchTransactionInsights/', view=api_views.fetchTransactionInsights, name='kMeans'),
    path(route='plotData/', view=api_views.plotData, name='plotData'),
    path(route='submitTransaction/', view=api_views.transactionSubmit, name='transactionSubmit'),
    path(route='fetchHistory/', view=api_views.historyView, name='historyView'),
    path(route='fetchHistory/<int:t_id>/', view=api_views.historyView, name='historyViewURL')
]