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

    # Gathering the totals via expense and income
    exp_total = get_total('expense', data)
    inc_total = get_total('income', data)

    subweight = helper_subweight(data, subs, [inc_total, exp_total])    

    return Response({'subweights' : subweight})

# helper function to help create the subweights
def helper_subweight(data, choices, totals):
    # Creating a dictionary {[key = sub_categories, values = ]}
    sub_dict = dict(zip([s[0] for s in choices], [[0, 0] for x in range(len(choices))]))

    # Grand total of the sums
    total = sum(totals)
    
    # Gathering the total amount via the subtransaction-type
    for x in data:
        sub_dict[x.subtransaction_type][0]+=x.amount
        sub_dict[x.subtransaction_type][1]+=x.amount

    # Income categories, very important to perform operation via their respective categories
    inc_cats = ['portfolio', 'earned', 'passive']

    # Iterating through the values in the initialized dictionary
    for key, value in sub_dict.items():
        # If the subcategory is part of Income
        if key in inc_cats:
            if totals[0] != 0:
                sub_dict[key] = [round((value[0]/(totals[0])) * 100, 2), round((value[1]/total)*100, 2)]
            else:
                sub_dict[key] = [0, 0]
        else:
            if totals[1] != 0:
                sub_dict[key] = [round((value[0]/(totals[1])) * 100, 2), round((value[1]/total)*100, 2)]
            else:
                sub_dict[key] = [0, 0]

    return sub_dict

# GET request to show data pertaining to the month selected
@api_view(['GET'])
def filter_by_month(request):
    # Getting the month and year
    month = request.GET.get('month')
    year = request.GET.get('year')

    # Fetching data pertaining to the date
    model_data = models.Transaction.objects.filter(date__month=month, date__year=year, user=request.user.username)

    # Income Total
    income_total = get_total('income', model_data)
    # Expense Total
    expense_total = get_total('expense', model_data)

    # Gathering the subweights
    sub = helper_subweight(
        model_data, 
        models.Transaction.transaction_sub_choices,
        [income_total, expense_total]
        )

    return Response({
        'income': income_total,
        'expense': expense_total,
        'sub_weight': sub
    })
