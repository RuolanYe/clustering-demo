from django.urls import path
from . import views

urlpatterns = [
    path('images/', views.ImageView.as_view(), name= 'images_list'),
]