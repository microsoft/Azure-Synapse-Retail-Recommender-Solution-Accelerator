![Retail Recommender Solution Accelerator](./Resource_Deployment/imgs/RetailRecommender.png)


## About this repository
This accelerator was built to provide developers with all of the resources needed to quickly build an Retail Recommender Solution based on Azure Analytics Platform. 



## Prerequisites
In order to successfully complete your solution, you will need to have access to and or provisioned the following:
1. Access to an Azure subscription
2. Visual Studio 2017 or 2019
3. PowerShell
4. Azure Cli
5. Postman

Optional
1. Visual Studio Code

## Azure and Analytics Platform
The directions provided for this repository assume fundemental working knowledge of Azure, Cosmos DB, Azure Machine Learning Services, and Azure Kubernetes.

For additional training and support, please see:
 1. [Azure Synapse Analytics](https://azure.microsoft.com/en-us/services/synapse-analytics/)
 2. [Azure Kubernetes Services](https://kubernetes.io/)  
 3. [Azure Machine Learning Services](https://azure.microsoft.com/en-us/services/machine-learning/)
## Getting Started and Process Overview  
1. Clone this repository and navigate to the root of the directory  
2. Go to [Deployment guide](./Resource_Deployment/README.md) for the steps you need to take to deploy this solution  

The architecture diagram below details what you will be building for this Solution Accelerator:

![Microservices Architecture](./Reference/Architecture/retail_ai_v2_arch.png)

### [0 - Resource Deployment](./Resource_Deployment)
The resources in this folder can be used to deploy the required resources into your Azure Subscription. You can do this in the Azure Portal

### [1- Anaytics Deployment](./Analytics_Deployment)
This folder contains the Notebooks needed to complete this solution accelerator. Once you have deployed all the required resources from ResourceDeploymnet.md, run through the Notebooks following the instructions in [Resource Deployment](./Resource_Deployment). 

### [2- Application Front Web Application Deployment](./Application_Frontend_Deployment)
This folder contains the resources to deploy the front end web application. 

### [3- Application Backend API Deployment](./Application_Backend_Deployment)
This folder contains the resources for product details and managing the list of products that are presented to the Portal.  
  
### [4. ML Model Building](./ML_Model_Building)
This folder contains the resources for exploring how the model was constructed.

## Our Live Demo: Check it out!
Synapse/AI-Retail-Recommender:
* [Retail Web Site](https://delightful-water-0ac017a1e.azurestaticapps.net/), you check running demo from here.

## License
Copyright (c) Microsoft Corporation

All rights reserved.

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ""Software""), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE

## Note about Libraries with MPL-2.0 and LGPL-2.1 Licenses   
The following libraries are not **explicitly included** in this repository, but users who use this Solution Accelerator may need to install them locally and in Azure Synapse to fully utilize this Solution Accelerator. However, the actual binaries and files associated with the libraries **are not included** as part of this repository, but they are available for installation via the PyPI library using the pip installation tool.  
  
Libraries: chardet, certifi, pathspec

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
