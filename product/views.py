import json

from django.shortcuts import render
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_202_ACCEPTED, HTTP_226_IM_USED, HTTP_304_NOT_MODIFIED

from user.views import IsManagement
from .models import *
from .seriallizer import ProductSerializer


# Create your views here.
def dashboard(request):
    return render(request, "index.html")

def addProduct(request):
    return render(request, "add_product.html")

def editProduct(request, name):
    return render(request, "edit_product.html")

def saleProduct(request, name):
    return render(request, "sale_product.html")

def restockProduct(request, name):
    return render(request, "restock.html")

class APIProductList(ListAPIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        data = Product.objects.all()
        data = ProductSerializer(data, many=True).data
        return Response(data)

class APIEditProduct(ListAPIView):

    permission_classes = [IsAuthenticated, IsManagement]

    def get(self, request, name):
        data = Product.objects.filter(name=name).first()
        data = ProductSerializer(data).data
        return Response(data)

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

            product = Product.objects.filter(name=data['name']).first()

            if not product:

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

            else:

                result['status'] = HTTP_226_IM_USED
                result['massage'] = "Product already exists."
                return Response(result)

        except Exception as ex:
            result['massage'] = str(ex)
            return Response(result)

class APIUpdateProductQuantity(CreateAPIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):

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

class APIUpdateProductPrice(CreateAPIView):

    permission_classes = [IsAuthenticated, IsManagement]

    def put(self, request, *args, **kwargs):

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


            product = Product.objects.filter(name=data['name']).first()

            if product:

                if product.price != data['price']:

                    product.price = data['price']
                    product.save()

                    result['status'] = HTTP_202_ACCEPTED
                    result['massage'] = "Success"
                    result['name'] = data['name']
                    result['price'] = product.price
                    return Response(result)

                else:
                    result['status'] = HTTP_304_NOT_MODIFIED
                    result['massage'] = ("Product price is already " + str(data['price']))
                    return Response(result)

            else:
                result['status'] = HTTP_400_BAD_REQUEST
                result['massage'] = ("Product not exist")
                return Response(result)

        except Exception as ex:
            result['massage'] = str(ex)
            return Response(result)