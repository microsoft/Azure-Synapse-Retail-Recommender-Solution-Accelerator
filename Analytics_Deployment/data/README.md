## Additional Datasets Needed
  
We use the `product_details.json` to enhance the products served to the front-end with image information and cleaned up names.  
  
1. Upload this JSON to the Azure Data Lake Storage Account attached to your Synapse workspace  
    - Make sure you put it into the filesystem that is the Primary Filesystem for the Synapse workspace  
    - Put it in the folder `synapse/workspaces` in the filesystem that is the primary filesystem for the Synapse workspace
2. Import `1. Analytics Deployment\synapse-workspace\notebooks\CreateOrUpdateProductDetails.ipynb` to the Synapse workspace and fill out the parameters for the filesystem name and the account name  
3. Execute the Notebook  