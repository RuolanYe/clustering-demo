from django.db import models

# Create your models here.

class Image(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='post_images')
    x = models.DecimalField(max_digits=5, decimal_places=2)
    y = models.DecimalField(max_digits=5, decimal_places=2)
    cluster = models.IntegerField()
    
    def __str__(self):
        return self.title