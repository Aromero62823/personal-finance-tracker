from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from . import models

# Helper function to return the total in correspondence to the attribute specified
def get_total(attr, data):
    return sum([d.amount for d in data if d.transaction_type == attr])

# Returning the total amount via the income category
@api_view(['GET'])
def total_income(request):
    data = models.Transaction.objects.filter(user=request.user.username)
    total = get_total('income', data)
    return Response({'total income': total})

# Returning the total amount via the expense category
@api_view(['GET'])
def total_expense(request):
    data = models.Transaction.objects.filter(user=request.user.username)
    total = get_total('expense', data)
    return Response({'total expense': total})

# Returning the amount of weight that every category has
@api_view(['GET'])
def sub_weights(request):
    # Retrieving the data pertaining to the user
    data = models.Transaction.objects.filter(user=request.user.username)
    # Sub categories from the Transaction model
    subs = models.Transaction.transaction_sub_choices

    # Creating a dictionary {[key = sub_categories, values = ]}
    sub_dict = dict(zip([s[0] for s in subs], [[0, 0] for x in range(len(subs))]))

    # Gathering the totals via expense and income
    exp_total = get_total('expense', data)
    inc_total = get_total('income', data)
    total = exp_total+inc_total

    # Initilazing the values from the queried data
    for x in data:
        sub_dict[x.subtransaction_type][0]+=x.amount
        sub_dict[x.subtransaction_type][1]+=x.amount

    # Sub group of the income category
    inc_cats = ['portfolio', 'earned', 'passive']

    # Initializing 2 values at the same time, weight in accordance to the corresponding category
    # and weight in accordance to the total
    for key, value in sub_dict.items():
        if key in inc_cats:
            sub_dict[key] = [round((value[0]/(inc_total)) * 100, 2), round((value[1]/total)*100, 2)]
        else:
            sub_dict[key] = [round((value[0]/(exp_total)) * 100, 2), round((value[1]/total)*100, 2)]

    return Response({'subweights' : sub_dict})
