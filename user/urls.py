from django.urls import path
from .views import *

urlpatterns = [
    path('log_in', sign_in),
    path('user_list', userList),
    path('add', addFisherman),
    path('edit_user/<str:email>', editFisherman),
    path('user', fisherman),
    path('log_in_api', ApiLogIn.as_view()),
    path('logout_api', ApiLogOut.as_view()),
    path('add_fisherman_api', ApiCreateFisherman.as_view()),
    path('update_fisherman_api', ApiUpdateFisherman.as_view()),
    path('change_password_api', ApiChangePassword.as_view()),
    path('fisherman_list_api', APIFishermanList.as_view()),
    path('fisherman_edit_api/<str:email>', APIEditFisherman.as_view()),
]