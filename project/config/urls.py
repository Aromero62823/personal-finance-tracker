from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include("useraccounts.urls")), # Login/Registration made for user login and registration
    path('admin/', admin.site.urls)
]
