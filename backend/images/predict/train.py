import torch
import torch.nn as nn
import torchvision
import numpy as np
# from data_process import DogsDataset

class DogClassifier(nn.Module):
    def __init__(self, num_classes=120):
        super(DogClassifier, self).__init__()
        self.resnet18 = torchvision.models.resnet18(pretrained=True)
        self.fc = nn.Linear(1000, num_classes)

    def forward(self, x):
        out = self.resnet18(x)
        return self.fc(out)



# if __name__ == "__main__":
#     num_epochs = 50
#     learning_rate = 1e-4
#     batch_size = 128
#     test_freq = 5

#     device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

#     dataset = DogsDataset("./Images")
#     testset = DogsDataset("./Images", train=False)
#     categories = dataset.categories
#     np.save("./models/category.npy", categories)

#     train_loader = torch.utils.data.DataLoader(dataset=dataset,
#                                                batch_size=batch_size,
#                                                shuffle=True)
#     test_loader = torch.utils.data.DataLoader(dataset=testset,
#                                               batch_size=batch_size,
#                                               shuffle=False)

#     model = DogClassifier().to(device)
#     criterion = nn.CrossEntropyLoss()
#     optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)
#     total_step = len(train_loader)

#     for epoch in range(num_epochs):
#         for i, item in enumerate(train_loader):
#             images = item["image"].to(device)
#             labels = item["index"].to(device)

#             # Forward pass
#             outputs = model(images)
#             loss = criterion(outputs, labels)

#             # Backward and optimize
#             optimizer.zero_grad()
#             loss.backward()
#             optimizer.step()

#             if (i + 1) % 10 == 0:
#                 print('Epoch [{}/{}], Step [{}/{}], Loss: {:.4f}'
#                       .format(epoch + 1, num_epochs, i + 1, total_step, loss.item()))

#         if epoch % test_freq == 0:
#             model.eval()  # eval mode (batchnorm uses moving mean/variance instead of mini-batch mean/variance)
#             with torch.no_grad():
#                 correct = 0
#                 total = 0
#                 for item in test_loader:
#                     images = item["image"].to(device)
#                     labels = item["index"].to(device)
#                     outputs = model(images)
#                     _, predicted = torch.max(outputs.data, 1)
#                     total += labels.size(0)
#                     correct += (predicted == labels).sum().item()

#                 print('Test Accuracy of the model on test images: {} %'.format(100 * correct / total))
#             model.train()

#     torch.save(model.state_dict(), './models/model.pt')
