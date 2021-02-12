# Step 4 - Initialize Data
#### In this step we are going to deploy master data and upload images for Product and Profile APIs

## 1. Upload Product and Profile Images in Azure Blob Storage<br/>  2. Put Product and Profile Data into CosmosDB 

Just execute [Deploy3.ps1](Deploy3.ps1) file in your powershell console like below

     (Your Path)\3. Application Backend Deployment>.\Deploy3.ps1
Just in case you've got error for the file is not degitally signed, try to execute Deploy3.ps1 file like below

    Powershell.exe -executionpolicy remotesigned -File .\Deploy3.ps1

This script uploads Product and Profile images in the blob storage and then post Product and Profile master data to Cosmos DB via Product and Profile API services.

Finally whole deployment processes for Product and Profile API services have been completed.

  ### Step 4 : Initialize API Data
  - Set up Product / Profile master database
  - Set up Product Image Blob storage


#### [Go up Main Page](README.md)  | [Back to Previous Step 3](Step3.md)