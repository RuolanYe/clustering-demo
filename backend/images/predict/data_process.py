import os
import torchvision
import torch

from torch.utils.data import Dataset
from skimage import io

class DogsDataset(Dataset):
    """Face Landmarks dataset."""

    def __init__(self, image_path, train=True):
        self.image_path = image_path
        self.train = train
        self.folders = os.listdir(self.image_path)
        self.data = []
        self.image_count = 0
        self.categories = []
        self.AddAllImages()

    def AddAllImages(self):
        index = 0
        center_crop = torchvision.transforms.CenterCrop(250)
        for folder in self.folders:
            self.categories.append(''.join(folder.split("-")[1:]))
            col_dir = 'Images/' + folder + '/*.jpg'
            images = io.imread_collection(col_dir)
            image_range = [0, 100] if self.train else [101, 121]
            for i in range(*image_range):
                image_tensor = torch.FloatTensor(images[i]).permute(2, 0, 1)
                # skip corrupted images
                if len(image_tensor) != 3:
                    self.image_count -= 1
                    continue
                self.data.append(
                    {
                        "category": ''.join(folder.split("-")[1:]),
                        "image": center_crop(image_tensor),
                        "index": index
                    }
                )
            index += 1
            self.image_count += (image_range[1] - image_range[0])

    def __len__(self):
        return self.image_count

    def __getitem__(self, idx):
        return self.data[idx]
