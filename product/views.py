import json
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_202_ACCEPTED

from user.views import IsManagement
from .models import *


# Create your views here.


class APIAddProduct(CreateAPIView):

    permission_classes = [IsAuthenticated, IsManagement]

    def post(self, request, *args, **kwargs):

        result = {}

        try:
            data = json.loads(request.body)

            if "name" not in data or data["name"] == "":
                result["message"] = "Name is required"
                result["error"] = "Name"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'price' not in data or data['price'] == '':
                result['massage'] = "Price is required."
                result['error'] = "price"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'quantity' not in data or data['quantity'] == '':
                result['massage'] = "Quantity is required."
                result['error'] = "quantity"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'category' not in data or data['category'] == '':
                result['massage'] = "Must select a category."
                result['error'] = "category"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'source' not in data or data['source'] == '':
                result['massage'] = "source is required."
                result['error'] = "source"
                return Response(result, status=HTTP_400_BAD_REQUEST)

            product = Product()
            product.name = data['name']
            product.price = data['price']
            product.quantity = data['quantity']
            product.category = data['category']
            product.source = data['source']

            if 'description' not in data or data['description'] == '':
                product.description = ""
            else:
                product.description = data['description']

            product.save()

            result['status'] = HTTP_202_ACCEPTED
            result['massage'] = "Success"
            result['name'] = data['name']
            result['quantity'] = data['quantity']
            return Response(result)
        except Exception as ex:
            result['massage'] = str(ex)
            return Response(result)


class APIUpdateProduct(CreateAPIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        result = {}

        try:
            data = json.loads(request.body)

            if "name" not in data or data["name"] == "":
                result["message"] = "Name is required"
                result["error"] = "Name"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'quantity' not in data or data['quantity'] == '':
                result['massage'] = "Quantity is required."
                result['error'] = "quantity"
                return Response(result, status=HTTP_400_BAD_REQUEST)


            product = Product.objects.filter(name=data['name']).first()

            if product:
                product.quantity = product.quantity + data['quantity']
                product.save()

                result['status'] = HTTP_202_ACCEPTED
                result['massage'] = "Success"
                result['name'] = data['name']
                result['quantity'] = product.quantity
                return Response(result)

            else:
                result['status'] = HTTP_400_BAD_REQUEST
                result['massage'] = ("Product not exist")
                return Response(result)

        except Exception as ex:
            result['massage'] = str(ex)
            return Response(result)