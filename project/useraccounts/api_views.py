from rest_framework.response import Response
from rest_framework.decorators import api_view
from . import models
from sklearn.cluster import KMeans
import numpy as np

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


# K-means algorithm via a GET Request
@api_view(['GET'])
def fetchTransactionInsights(request):
    # Retreiving all data pertaining the user
    data = models.Transaction.objects.filter(user=request.user.username, transaction_type='expense')

    # Extracting values from the filtered data
    data_values = [{'id':x.id, 'amount': x.amount, 'month': x.date.month, 'transaction_type': x.transaction_type, 'sub_type': x.subtransaction_type} for x in data]

    # Implementing the K-means algorithm
    kmeans = KMeans(n_clusters=3, random_state=42)

    # Values based off of the month(as an int) and the amount(float)
    X = np.array([[r['amount']] for r in data_values])

    # Fits the data and gather the centroids in correspondence to the number of clusters
    kmeans.fit(X)
    centroids = kmeans.cluster_centers_
    ranks = sorted(range(3), key=lambda i: centroids[i])
    cluster_group = {ranks[0]: 'small', ranks[1]: 'medium', ranks[2]: 'large'}
    labels = kmeans.labels_

    # Categorizing the clusters based off of the amount closest to the centroid via label
    for i, entry in enumerate(data_values):
        entry['cluster'] = cluster_group[labels[i]]

    # Creating a summary to send to the frontend and display the user the output of the kmeans via the user's expenses
    s_transaction = [x for x in data_values if x['cluster'] == 'small']
    m_transaction = [x for x in data_values if x['cluster'] == 'medium']
    l_transaction = [x for x in data_values if x['cluster'] == 'large']
    # Fetching the sum to find the percentage via the amount to the total
    total = sum([e.amount for e in data])

    small = {
        'size': 'Small',
        'instances': len(s_transaction),
        'amount': sum(s['amount'] for s in s_transaction),
        'center': centroids[ranks[0]],
        'percent': round(sum([s['amount'] for s in s_transaction])/total, 2)
    }

    medium = {
        'size': 'Medium',
        'instances': len(m_transaction),
        'amount': sum(m['amount'] for m in m_transaction),
        'center': centroids[ranks[1]],
        'percent': round(sum([m['amount'] for m in m_transaction])/total, 2)
    }

    large = {
        'size': 'Large',
        'instances': len(l_transaction),
        'amount': sum(l['amount'] for l in l_transaction),
        'center': centroids[ranks[2]],
        'percent': round(sum([l['amount'] for l in l_transaction])/total, 2)
    }

    return Response({'small': small, 'medium': medium, 'large': large})