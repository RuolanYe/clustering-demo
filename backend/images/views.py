from re import X
from tkinter import image_names
from django.http import JsonResponse
from .serializers import ImageSerializer
from .models import Image
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
import random
import copy
import torch
import numpy as np
# import os
# print(os.getcwd())
from images.predict.infer import predict_dog_class 
from images.predict.train import DogClassifier
from skimage import io
# Create your views here.

class ImageView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    
    categories = np.load("./images/predict/models/category.npy")
    model = DogClassifier()
    model.load_state_dict(torch.load("./images/predict/models/model.pt", map_location=torch.device('cpu')))
    model.eval()
    print("Finished loading model ...")
    

    def get(self, request, *args, **kwargs):
        images = Image.objects.all()
        serializer = ImageSerializer(images, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # images_serializer = ImageSerializer(data=request.data)
        post = request.POST.copy() # to make it mutable
        post['title'] = request.data['title']
        post['image'] = copy.deepcopy(request.data['image'])
        probability = round(random.random()*100)
        post['probability'] = probability
        post['cluster'] = 'a_dog_class'
        test_image = io.imread(request.data['image'])
        post['cluster'] = predict_dog_class(test_image, self.model, self.categories)
        
        # print('new post')
        # print(post)
        # print(test_image)
        images_serializer = ImageSerializer(data=post)
        if images_serializer.is_valid():
            images_serializer.save()
            return Response(images_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', images_serializer.errors)
            return Response(images_serializer.errors, status=status.HTTP_400_BAD_REQUEST)