from django.contrib import admin
from .models import Sell, Buy, Activity

class SellAdmin(admin.ModelAdmin):
    list_display = ('invoice_no', 'customer_name', 'customer_phone', 'customer_address', 'seller', 'product', 'quantity', 'unit_price', 'total_amount', 'created_by', 'modified_by', 'created_at', 'modified_at')
admin.site.register(Sell, SellAdmin)

class BuyAdmin(admin.ModelAdmin):
    list_display = ('invoice_no', 'supplier_name', 'supplier_phone', 'supplier_address', 'buying_manager', 'product', 'quantity', 'buying_price', 'total_amount', 'created_by', 'modified_by', 'created_at', 'modified_at')
admin.site.register(Buy, BuyAdmin)

class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'time', 'is_login')
admin.site.register(Activity, ActivityAdmin)