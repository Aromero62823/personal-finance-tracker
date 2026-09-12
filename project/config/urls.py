from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include("useraccounts.urls")), # Login/Registration made for user login and registration
    path('admin/', admin.site.urls)
]

urlpatterns += [
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]
