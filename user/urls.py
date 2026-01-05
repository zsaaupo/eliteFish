from django.urls import path
from .views import ApiLogIn, ApiCreateFisherman

urlpatterns = [
    path('log_in', ApiLogIn.as_view()),
    path('add_fisherman', ApiCreateFisherman.as_view()),
]