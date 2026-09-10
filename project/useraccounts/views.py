from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from . import models
import json
import plotly.express as px
import pandas as pd
from datetime import datetime

# Create your views here.
def loginView(request):
    logout(request) # Making sure that if there is a user logged in, there session data will be erased
    if request.method == "POST":
        try:
            username = request.POST['username']
            password = request.POST['password']

            user = authenticate(request, username=username, password=password)
            login(request, user)

            return redirect('home/')
            
        except Exception as e:
            print(f'Login Failed: {e}')

    return render(request, template_name='login.html')

# Registration data that the user sends
def registerView(request):
    if request.method == 'POST':
        try:
            username = request.POST['username']
            password = request.POST['password']
            f_name = request.POST['first_name']
            l_name = request.POST['last_name']
            # User authentication that will return user if that username already exists in the db, None if the username is unique
            if(authenticate(request, username=username, password=password) is None):
                print('Creating')
                # First name and last name inputs are optional
                User.objects.create_user(username=username, password=password, first_name=f_name, last_name=l_name)
                return redirect('/')
            else:
                print('username already exists....')
            
        except Exception as e:
            print(e)

    return render(request, template_name='register.html')

@login_required
def logoutView(request):
    logout(request)
    return redirect('/')

# Helper function to extract values of the transaction model that pertain to the user
def get_plot(transactions):
    if len(transactions) != 0:
        z = {
            'Date': [x.date for x in transactions],
            'Amount': [y.amount for y in transactions],
            'Type' : [y.transaction_type for y in transactions]
        }

        # Converting data to Dataframe
        df  = pd.DataFrame(z)

        # Standard Pie 
        fig = px.pie(
            data_frame=df,
            values='Amount',
            names='Type',
            title="Expenses vs Income"
        )
        fig.update_traces(textposition='inside', textinfo='percent+label', insidetextorientation='horizontal')

        plot = fig.to_html(full_html=False)
    else:
        plot = None
    return plot

# Creating a simple plot to output to the html homepage
@login_required
def homepage(request):
    if request.method == "POST":
            data = json.loads(request.body)
            month = data.get('month')
            year = data.get('year')
            transactions = models.Transaction.objects.filter(user=request.user.username, date__month=month, date__year=year)
            amount = [x.amount for x in transactions]
            type = [y.transaction_type for y in transactions]
            return JsonResponse({'amount': amount, 'type' : type})
    # Retrieving data for the current month
    date = datetime.now()
    # Query all data pertaining to the user
    transactions = models.Transaction.objects.filter(user=request.user.username)
    curr_date = date.strftime('%B %Y')
    
    plot = get_plot(transactions=transactions)

    return render(request, template_name='home.html', context={'username': request.user.username, 'curr_date': curr_date, 'plot': plot })


@login_required
def transactionView(request):
    if request.method == 'POST':
        try:
            transaction_type = request.POST['t_type']
            amount = request.POST['amount']
            date = request.POST['date']
            message = request.POST['message_box'] if request.POST['message_box'] != "" else ""

            transaction = models.Transaction.objects.create(
                user=request.user,
                transaction_type=transaction_type,
                amount=amount,
                date=date,
                message=message
            )
            transaction.save()
        except Exception as e:
            print(f'Error: {e}')
        
    return render(request, template_name='transaction.html', context={'username': request.user.username })


@login_required
def historyView(request):
    # Showing all the transactions(Expenses and Income) for the current month with the ability to go back in the past to fix or edit anything else.
    h_data = models.Transaction.objects.filter(user=request.user.username)
    # Updating existing Data(Saving Changes)
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            transaction = models.Transaction.objects.get(id=data.get('id'))
            for key, value in data.items():
                if key == 'id' or value == None or value.strip() == '':
                    continue
                else:
                    if key == 'amount':
                        setattr(transaction, key, float(value))                        
                    else:
                        setattr(transaction, key, value)
                    
            transaction.save()
            
        except Exception as e:
            return JsonResponse(data={'error': str(e)}, status=404)
        
        return JsonResponse(data={'message':'Database updated', 'status':'success'}, status=200)

    # Deleting Data
    if request.method == "DELETE":
            id = json.loads(request.body)
            obj = models.Transaction.objects.get(id=id)
            obj.delete()

    if request.method == "POST":
        r_date = json.loads(request.body)
        month = r_date.get('month')
        year = r_date.get('year')
        data = models.Transaction.objects.filter(user=request.user.username, date__month=month, date__year=year)
        payload = {
            "amount": [x.amount for x in data],
            "date": [x.date for x in data],
            "type": [x.transaction_type for x in data],
            "message": [x.message for x in data]
        }
        return JsonResponse({'payload': payload})

    return render(request, template_name='history.html', context={'username': request.user.username, 'history': h_data })
