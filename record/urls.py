from django.urls import path
from .views import APISellLog

urlpatterns = [
    path('sell_api', APISellLog.as_view()),
]