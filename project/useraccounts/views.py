from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required

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
    return render(request, template_name='home.html', context={'username': f'{request.user.username}'})
