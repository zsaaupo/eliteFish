from django.urls import path
from .views import APISellLog, APIBuyLog, record

urlpatterns = [
    path('', record),
    path('sell_api', APISellLog.as_view()),
    path('buy_api', APIBuyLog.as_view()),
]