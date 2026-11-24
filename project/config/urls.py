from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView

react_app = ensure_csrf_cookie(login_required(TemplateView.as_view(template_name="index.html")))

urlpatterns = [
    path('', include("useraccounts.urls")), # Login/Registration made for user login and registration
    path('api/', include('useraccounts.api_urls')),
    path('admin/', admin.site.urls),
    re_path(r"^(?!api/|admin/|static/|login/|register/|logout/).*$", react_app),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]
