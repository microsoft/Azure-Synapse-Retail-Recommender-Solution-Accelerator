# Introduction 
Contoso Retail User Profile / Product Catalog APIs

# Prerequisites
1. [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) - For Azure Resources and Source code deployment
2. [Kubectl](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) - For Deploying API Services and Configuration
3. [Docker Desktop](https://www.docker.com/get-started) - For Debugging in local or containerizing codes in Deployment process
4. [PowerShell 7.x](https://github.com/PowerShell/PowerShell#get-powershell) - For executing Deployment Script
5. [Helm 3.x](https://helm.sh/docs/intro/install/) - For installing cert-manager, ingress-nginx Ingress Controller

# (Local) Build and Test
1. Local build and test : Open solution file [/Contoso.Retail.NextGen/src/ContosoRetail.NextGen.API.sln](/Contoso.Retail.NextGen/src/Contoso.Retail.NextGen.API.sln) from your Visual Studio. (Recommend using Visual Studio 2019)

Through AzurePiple line, you may deploy on Kubernetes cluster.
Check [deployment.yaml](/Contoso.Retail.NextGen/manifests/deployment.yaml), [service.yaml](Contoso.Retail.NextGen/manifests/service.yml) in [menifests](Contoso.Retail.NextGen/manifest) folder and [azure-pipelines.yml](Contoso.Retail.NextGen/azure-pipelines.yml)

# Getting Started
Most of Deployment will be automated with scripts but some manual configuration work is required

- Step 1 : [Deploy Azure Resources](Step1,2.md) -  [Deploy1.bat](Deploy1.bat)
  - Deploy Azure Container Registry Service
  - Deploy Azure Kubernetes Service
  - Deploy Azure Storage Account
  - Deploy Azure CosmosDB Mongo API
  - Setting ServicePrinciple to work together with ACR and AKS

- Step 2 : Configurure Kubernetes Ingress Controller and Cert Manager
  - Deploy API Services in Kubernetes
  - Deploy Nginix Ingress Controller in Kubernetes
  - Deploy cert-manager to preparing self-signed certificate to support SSL
    
- Step 3: [Configure SSL](Step3.md) -  [Deploy2.ps1](Deploy2.ps1) > [setupClusterIssuer-prod.yaml](setupClusterIssuer-prod.yaml) -> [setupIngress-prod.yaml](setupIngress-prod.yaml)
  - Creating Certificate Issuer
  - Creating Certicifate with LetsEncrypt
  - Config Ingress Controller for Services to support SSL
- Step 4 : [Initialize Data](Step4.md) - [Deploy3.ps1](Deploy3.ps1)
  - Upload Profile / Product Images in Blob Storage Account
  - Post Product master database via API services
  
##### [>> Goto Step 1 & 2](Step1,2.md)