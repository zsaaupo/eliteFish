from django.urls import path
from .views import APISellLog, APIBuyLog, record, buy_record, APIBuyList, sell_record, activity_record, APISellList, APIActivityList

urlpatterns = [
    path('', record),
    path('buy/', buy_record),
    path('sell/', sell_record),
    path('activity/', activity_record),
    path('buy_list_api', APIBuyList.as_view()),
    path('sell_list_api', APISellList.as_view()),
    path('activity_list_api', APIActivityList.as_view()),
    path('sell_api', APISellLog.as_view()),
    path('buy_api', APIBuyLog.as_view()),
]