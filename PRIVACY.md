# Privacy 
When you deploy this template, Microsoft is able to identify the installation of the software with the Azure resources that are deployed. Microsoft is able to correlate the Azure resources that are used to support the software. Microsoft collects this information to provide the best experiences with their products and to operate their business. The data is collected and governed by Microsoft's privacy policies, which can be found at [Microsoft Privacy Statement](https://go.microsoft.com/fwlink/?LinkID=824704).

To disable this, simply remove the following section from [deployment_script.ps1](./Resource_Deployment/deployment_script.ps1) before deploying the resources to Azure:

* `deployment_script.ps1`

    ``` 
    #adding Tag
    az deployment group create --resource-group $resource_group --subscription $subscriptionId  --template-file .\azuredeploy.json
    ```

You can see more information on this at [https://docs.microsoft.com/en-us/azure/marketplace/azure-partner-customer-usage-attribution.](https://docs.microsoft.com/en-us/azure/marketplace/azure-partner-customer-usage-attribution).
