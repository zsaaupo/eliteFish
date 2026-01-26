from django.contrib import admin
from django.urls import path, include
from product.views import dashboard

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', dashboard),
    path('fisher_man/', include('user.urls')),
    path('fish/', include('product.urls')),
    path('log/', include('record.urls')),
]
