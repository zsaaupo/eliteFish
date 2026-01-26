import json
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_202_ACCEPTED, HTTP_226_IM_USED, HTTP_304_NOT_MODIFIED
from .models import Sell

# Create your views here.

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
                result['massage'] = "Product is required."
                result['error'] = "product"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'quantity' not in data or data['quantity'] == '':
                result['massage'] = "Quantity is required."
                result['error'] = "quantity"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'unit_price' not in data or data['unit_price'] == '':
                result['massage'] = "Unit price is required."
                result['error'] = "unit_price"
                return Response(result, status=HTTP_400_BAD_REQUEST)
            if 'total_amount' not in data or data['total_amount'] == '':
                result['massage'] = "Total amount is required."
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
            result['massage'] = "Success"
            return Response(result)

        except Exception as ex:
            result['massage'] = str(ex)
            return Response(result)
    