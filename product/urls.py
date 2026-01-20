from django.urls import path
from .views import *

urlpatterns = [
    path('add_product', addProduct),
    path('edit_product/<str:name>', editProduct),
    path('restock_product/<str:name>', restockProduct),
    path('sale/<str:name>', saleProduct),
    path('add_product_api', APIAddProduct.as_view()),
    path('edit_product_api/<str:name>', APIEditProduct.as_view()),
    path('update_quantity_api', APIUpdateProductQuantity.as_view()),
    path('update_price_api', APIUpdateProductPrice.as_view()),
    path('products_api', APIProductList.as_view()),
]