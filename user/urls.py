from django.urls import path
from .views import *

urlpatterns = [
    path('log_in', sign_in),
    path('user_list', userList),
    path('log_in_api', ApiLogIn.as_view()),
    path('add_fisherman_api', ApiCreateFisherman.as_view()),
    path('update_fisherman_api', ApiUpdateFisherman.as_view()),
    path('change_password_api', ApiChangePassword.as_view()),
    path('fisherman_list_api', APIFishermanList.as_view()),
]