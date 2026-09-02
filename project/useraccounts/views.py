from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from . import models
import json

# Create your views here.
def login_view(request):
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


def register_view(request):
    if request.method == 'POST':
        try:
            username = request.POST['username']
            password = request.POST['password']
            if(authenticate(request, username=username, password=password) is None):
                print('Creating')
                User.objects.create_user(username=username, password=password)
                return redirect('/')
            
        except Exception as e:
            print(e)

    return render(request, template_name='register.html')


def log_out(request):
    logout(request)
    return redirect('/')


@login_required
def home_page(request):
    return render(request, template_name='home.html', context={'username': request.user.username })


@login_required
def transaction_view(request):
    if request.method == 'POST':
        transaction_type = request.POST['t_type']
        amount = request.POST['amount']
        date = request.POST['date']
        message = request.POST['message_box'] if request.POST['message_box'] != "" else ""

        try:
            transaction = models.Transaction.objects.create(
                user=request.user,
                transaction_type=transaction_type,
                amount=amount,
                date=date,
                message=message
            )
            transaction.save()
        except Exception as e:
            print(e)
        
    return render(request, template_name='transaction.html', context={'username': request.user.username })


@login_required
def history_view(request):
    # Showing all the transactions(Expenses and Income) for the current month with the ability to go back in the past to fix or edit anything else.
    h_data = models.Transaction.objects.filter(user=request.user)
    if request.method == 'POST':
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
    return render(request, template_name='history.html', context={'username': request.user.username, 'history': h_data })
