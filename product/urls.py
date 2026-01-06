from django.urls import path
from .views import *

urlpatterns = [
    path('add_product', APIAddProduct.as_view()),
    path('update_product', APIUpdateProduct.as_view()),
]