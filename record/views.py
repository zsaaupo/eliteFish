import json
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_202_ACCEPTED, HTTP_226_IM_USED, HTTP_304_NOT_MODIFIED
from .models import Sell, Buy
from user.views import IsManagement

# Create your views here.

def record(request):
    return render(request, 'record.html')

class APISellLog(CreateAPIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        result = {}

        try:
            data = json.loads(request.body)

            if "customer_name" not in data or data["customer_name"] == "":
                result["message"] = "Name is required"
                result["error"] = "customer_name"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'product' not in data or data['product'] == '':
                result['message'] = "Product is required."
                result['error'] = "product"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'quantity' not in data or data['quantity'] == '':
                result['message'] = "Quantity is required."
                result['error'] = "quantity"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'unit_price' not in data or data['unit_price'] == '':
                result['message'] = "Unit price is required."
                result['error'] = "unit_price"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'total_amount' not in data or data['total_amount'] == '':
                result['message'] = "Total amount is required."
                result['error'] = "total_amount"
                return Response(result, status=HTTP_400_BAD_REQUEST)

            requested_user = request.user.username

            sell = Sell()

            sell.customer_name = data['customer_name']
            if data['customer_phone']:
                sell.customer_phone = data['customer_phone']
            if data['customer_address']:
                sell.customer_address = data['customer_address']
            sell.product = data['product']
            sell.quantity = data['quantity']
            sell.unit_price = data['unit_price']
            sell.total_amount = data['total_amount']
            sell.seller = requested_user
            sell.created_by = requested_user
            sell.save()

            result['status'] = HTTP_202_ACCEPTED
            result['message'] = "Success"
            return Response(result)

        except Exception as ex:
            result['message'] = str(ex)
            return Response(result)

class APIBuyLog(CreateAPIView):

    permission_classes = [IsAuthenticated, IsManagement]

    def post(self, request, *args, **kwargs):

        result = {}

        try:
            data = json.loads(request.body)

            if "supplier_name" not in data or data["supplier_name"] == "":
                result["message"] = "Name is required"
                result["error"] = "supplier_name"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if "supplier_phone" not in data or data["supplier_phone"] == "":
                result["message"] = "Phone is required"
                result["error"] = "supplier_phone"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'product' not in data or data['product'] == '':
                result['message'] = "Product is required."
                result['error'] = "product"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'quantity' not in data or data['quantity'] == '':
                result['message'] = "Quantity is required."
                result['error'] = "quantity"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'buying_price' not in data or data['buying_price'] == '':
                result['message'] = "Buying price is required."
                result['error'] = "buying_price"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'total_amount' not in data or data['total_amount'] == '':
                result['message'] = "Total amount is required."
                result['error'] = "total_amount"
                return Response(result, status=HTTP_400_BAD_REQUEST)

            requested_user = request.user.username

            buy = Buy()

            buy.supplier_name = data['supplier_name']
            buy.supplier_phone = data['supplier_phone']
            if data['supplier_address']:
                buy.supplier_address = data['supplier_address']
            if data['description']:
                buy.description = data['description']
            buy.product = data['product']
            buy.quantity = data['quantity']
            buy.buying_price = data['buying_price']
            buy.total_amount = data['total_amount']
            buy.buying_manager = requested_user
            buy.created_by = requested_user
            buy.save()

            result['status'] = HTTP_202_ACCEPTED
            result['message'] = "Success"
            return Response(result)

        except Exception as ex:
            result['message'] = str(ex)
            return Response(result)
     