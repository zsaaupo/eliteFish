from django.urls import path
from .views import *

urlpatterns = [
    path('add_product_api', APIAddProduct.as_view()),
    path('update_quantity_api', APIUpdateProductQuantity.as_view()),
    path('update_price_api', APIUpdateProductPrice.as_view()),
    path('products_api', APIProductList.as_view()),
]