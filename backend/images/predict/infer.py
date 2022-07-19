import torch
import torch.nn as nn
import torchvision
import numpy as np

# from train import DogClassifier
# from skimage import io

def predict_dog_class(image, model, categories):
    '''
    :param image: numpy array represents an image with shape [Channel, Height, Weight]
    :param model: a pytorch model
    :return: a string label
    '''
    center_crop = torchvision.transforms.CenterCrop(250)
    image_tensor = center_crop(torch.FloatTensor(image).permute(2, 0, 1)).unsqueeze(0)
    outputs = model(image_tensor)
    _, predicted = torch.max(outputs.data, 1)
    return categories[predicted[0]]


# if __name__ == "__main__":
    # categories = np.load("./models/category.npy")
    # model = DogClassifier()
    # model.load_state_dict(torch.load("./models/model.pt", map_location=torch.device('cpu')))
    # model.eval()
    # test_image = io.imread("test.jpg")
    # print("Finished loading model ...")
    
    # print("This dos is " + predict_dog_class(test_image, model, categories))
