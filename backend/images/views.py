from re import X
from django.http import JsonResponse
from .serializers import ImageSerializer
from .models import Image
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
import random
# Create your views here.

class ImageView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        images = Image.objects.all()
        serializer = ImageSerializer(images, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # images_serializer = ImageSerializer(data=request.data)
        post = request.POST.copy() # to make it mutable
        post['title'] = request.data['title']
        post['image'] = request.data['image']
        x = round(random.random()*100)
        y = round(random.random()*100)
        post['x'] = x
        post['y'] = y
        # post['cluster'] = 3
        if x<=50:
            if y<=50:
                post['cluster'] = 1
            else:
                post['cluster'] = 2
        else:
            post['cluster'] = 3
        
        
        # print('request')
        # print(request.data)
        # print('new post')
        # print(post)
        images_serializer = ImageSerializer(data=post)
        if images_serializer.is_valid():
            images_serializer.save()
            return Response(images_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', images_serializer.errors)
            return Response(images_serializer.errors, status=status.HTTP_400_BAD_REQUEST)