from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.models import User, Group
from django.shortcuts import render
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED, HTTP_200_OK, HTTP_202_ACCEPTED, \
    HTTP_226_IM_USED, HTTP_304_NOT_MODIFIED, HTTP_404_NOT_FOUND
from rest_framework.utils import json
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import FisherMan
from .seriallizer import FisherManSerializer

def sign_in(request):
    return render(request, "login.html")

def userList(request):
    return render(request, "user_list.html")

def editFisherman(request, email):
    return render(request, "edit_fisherman.html")

def fisherman(request):
    return render(request, "fisherman.html")

def addFisherman(request):
    return render(request, "add_fisherman.html")

class IsManagement(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.groups.filter(name__in=["Manager", "Owner"]).exists())

class APIFishermanList(ListAPIView):

    permission_classes = [IsAuthenticated, IsManagement]

    def get(self, request, *args, **kwargs):
        data = FisherMan.objects.all()
        data = FisherManSerializer(data, many=True).data
        return Response(data)

class APIEditFisherman(ListAPIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, email):
        data = FisherMan.objects.filter(email=email).first()
        data = FisherManSerializer(data).data
        return Response(data)

class ApiCreateFisherman(CreateAPIView):

    permission_classes = [IsAuthenticated, IsManagement]

    def post(self, request):

        result = {}

        try:
            data = json.loads(request.body)

            if 'name' not in data or data['name'] == '':
                result['massage'] = "Name can not be null."
                result['error'] = "Full name"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'email' not in data or data['email'] == '':
                result['massage'] = "Email can not be null."
                result['error'] = "Email"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'phone' not in data or data['phone'] == '':
                result['massage'] = "Phone number can not be null."
                result['error'] = "Phone number"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'designation' not in data or data['designation'] == '':
                result['massage'] = "Designation can not be null."
                result['error'] = "designation"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'password' not in data or data['password'] == '':
                result['massage'] = "Password can not be null."
                result['error'] = "Password"
                return Response(result, status=HTTP_400_BAD_REQUEST)

            user = User.objects.filter(username=data['email']).first()

            if not user:

                user = User()
                user.username = data['email']
                user.password = make_password(data['password'])
                user.save()
                if data['designation'] == 2:
                    user.groups.add(Group.objects.get(name='Staff'))
                if data['designation'] == 1:
                    user.groups.add(Group.objects.get(name='Manager'))
                if data['designation'] == 0:
                    user.groups.add(Group.objects.get(name='Owner'))
                user.save()

                fisherMan = FisherMan()
                fisherMan.name = data['name']
                fisherMan.email = data['email']
                fisherMan.phone = data['phone']
                fisherMan.designation = data['designation']
                fisherMan.user = user
                fisherMan.save()

                result['status'] = HTTP_202_ACCEPTED
                result['massage'] = "Success"
                result['phone'] = data['phone']
                result['email'] = data['email']
                return Response(result)
            else:
                result['status'] = HTTP_226_IM_USED
                result['massage'] = "This user already have a account"
                return Response(result)

        except Exception as ex:
            result['massage'] = str(ex)
            return Response(result)

class ApiUpdateFisherman(CreateAPIView):

    permission_classes = [IsAuthenticated, IsManagement]

    def put(self, request):

        result = {}
        try:
            data = json.loads(request.body)

            if 'email' not in data or data['email'] == '':
                result['massage'] = "Email can not be null."
                result['error'] = "Email"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            user = User.objects.filter(username=data['email']).first()

            if user:

                fisherman = user.fisherman
                userFlag = 0
                fishermanFlag = 0

                if 'active' in data:
                    if data['active'] == '' or data['active'] not in [0, 1]:
                        result['massage'] = "Wrong active status."
                        result['error'] = "active"
                        return Response(result, status=HTTP_400_BAD_REQUEST)
                    else:
                        activeStatus = data['active']
                        match activeStatus:
                            case 0:
                                if user.is_active == 1:
                                    user.is_active = data['active']
                                    userFlag = 1

                                    result['active'] = user.is_active
                                else:
                                    result['status'] = HTTP_304_NOT_MODIFIED
                                    result['massage'] = "User already deactivated"
                                    return Response(result)
                            case 1:
                                if user.is_active == 0:
                                    user.is_active = data['active']
                                    userFlag = 1

                                    result['active'] = user.is_active
                                else:
                                    result['status'] = HTTP_304_NOT_MODIFIED
                                    result['massage'] = "User already activated"
                                    return Response(result)

                if 'name' in data:
                    if data['name'] == '':
                        result['massage'] = "Name can not be null."
                    else:
                        fisherman.name = data['name']
                        fishermanFlag = 1
                        result['name'] = data['name']

                if 'phone' in data:
                    if data['phone'] == '':
                        result['massage'] = "Phone can not be null."
                    else:
                        fisherman.phone = data['phone']
                        fishermanFlag = 1
                        result['phone'] = data['phone']

                if userFlag == 1:
                    user.save()
                if fishermanFlag == 1:
                    fisherman.save()

                result['status'] = HTTP_202_ACCEPTED
                result['massage'] = "Success"
                return Response(result)

            else:
                result['status'] = HTTP_404_NOT_FOUND
                result['massage'] = "User not exist"
                return Response(result)

        except Exception as ex:
            result['massage'] = str(ex)
            return Response(result)

class ApiChangePassword(CreateAPIView):

    permission_classes = [IsAuthenticated]

    def put(self, request):

        result = {}
        try:
            data = json.loads(request.body)

            if 'password' not in data or data['password'] == '':
                result['massage'] = "Password can not be null."
                result['error'] = "password"
                return Response(result, status=HTTP_400_BAD_REQUEST)

            else:
                user = request.user
                user.password = make_password(data['password'])
                user.save()

                result['status'] = HTTP_202_ACCEPTED
                result['massage'] = "Success"
                return Response(result)

        except Exception as ex:
            result['massage'] = str(ex)
            return Response(result)

class ApiLogIn(APIView):

    permission_classes = []

    def post(self, request, *args, **kwargs):
        result = {}

        try:
            data = json.loads(request.body)
            if 'email' not in data or data['email'] == '':
                result['message'] = "Email can not be null."
                result['Error'] = "Email"
                return Response(result, status=HTTP_400_BAD_REQUEST)

            if 'password' not in data or data['password'] == '':
                result['message'] = "Password can not be null."
                result['Error'] = "Password"
                return Response(result, status=HTTP_400_BAD_REQUEST)

            user = User.objects.filter(username=data['email']).first()
            if not user:
                result['message'] = "Please create a account."
                return Response(result, status=HTTP_400_BAD_REQUEST)
            elif not user.is_active:
                result['message'] = "Please active your account."
                return Response(result, status=HTTP_400_BAD_REQUEST)
            else:
                if not check_password(data['password'], user.password):
                    result['message'] = "Wrong password"
                    return Response(result, status=HTTP_401_UNAUTHORIZED)
                else:
                    fisherMan = FisherMan.objects.filter(user=user).first()
                    token = RefreshToken.for_user(user)
                    data = {}
                    data['user_name'] = user.username
                    data['full_name'] = fisherMan.name
                    data['email'] = fisherMan.email
                    data['group'] = fisherMan.user.groups.first().name
                    data['access'] = str(token.access_token)
                    data['token'] = str(token)
                    data['status'] = HTTP_200_OK

                    return Response(data)

        except Exception as e:
            print("exp")
            result['message'] = str(e)
            return Response(result)