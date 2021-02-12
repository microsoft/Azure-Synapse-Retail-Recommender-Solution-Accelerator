# Copyright (c) Microsoft Corporation.
# Licensed under the MIT license.

param(
    [Parameter(Mandatory = $True)]
    [string]
    $location = '',

    [Parameter(Mandatory = $True)]
    [string]
    $subscriptionID = '',

    [Parameter(Mandatory = $True)]
    [string]
    $CertificateEamil = '',

    [Parameter(Mandatory = $True)]
    [string]
    $existingresourceGroupName = '',

    [Parameter(Mandatory = $True)]
    [string]
    $existingstorageAccountName = '',

    [Parameter(Mandatory = $True)]
    [string]
    $existingcosmosDBName = '',

    [Parameter(Mandatory = $True)]
    [string]
    $recommendMLServiceURL = '',

    [Parameter(Mandatory = $True)]
    [string]
    $recommendMLServiceBearerToken = ''
)

#CreateRandom 3 digit not to duplicate DNS Name
$surfix = (Get-Random -Maximum 999).toString().PadLeft(3, "0")

$resourceGroupName = $existingresourceGroupName
$azurecosmoaccount = $existingcosmosDBName
$storageAccountName = $existingstorageAccountName

$containerregistry = "contosoretailacr$surfix"
$kubernateservice = "contosoretailk8s$surfix"

#Set up yaml files to adding public endpoint
((Get-Content -path .\Deploy2.ps1.template -Raw) -replace '{emailaddress}', $CertificateEamil) | Set-Content -Path .\Deploy2.ps1
((Get-Content -path .\Deploy2.ps1 -Raw) -replace '{resourcegroup}', $resourceGroupName) | Set-Content -Path .\Deploy2.ps1
((Get-Content -path .\Deploy2.ps1 -Raw) -replace '{kubernetesname}', $kubernateservice) | Set-Content -Path .\Deploy2.ps1

((Get-Content -path .\Deploy3.ps1.template -Raw) -replace '{resourcegroup}', $resourceGroupName) | Set-Content -Path .\Deploy3.ps1
((Get-Content -path .\Deploy3.ps1 -Raw) -replace '{storageaccount}', $storageAccountName) | Set-Content -Path .\Deploy3.ps1
((Get-Content -path .\Deploy3.ps1 -Raw) -replace '{cosmosdbname}', $storageAccountName) | Set-Content -Path .\Deploy3.ps1

Write-Host "Login Azure.....`r`n"
az login

Write-Host "Select subscription '$subscriptionID'"
az account set --subscription $subscriptionID
Write-Host "Switched subscription to '$subscriptionID'"


$resourceGroup = az group exists -n $resourceGroupName
if ($resourceGroup -eq $false) {
    throw "The Resource group '$resourceGroupName' is not exist`r`n Please check resource name and try it again"
}

# az group create `
#     --location $location `
#     --name $resourceGroupName `
#     --subscription $subscriptionID


Write-Host "Step 1 - Creating Azure Container Registry ..."
# Create a Container Registry   
az acr create `
    --name $containerregistry `
    --resource-group $resourceGroupName `
    --location $location `
    --subscription $subscriptionID `
    --sku "Standard"
az acr update --name $containerregistry --admin-enabled true


# Step 1 - Retrieve configuration setting
Write-Host "Retriving configuration setting ..."

$acrList = az acr list | Where-Object { $_ -match $containerregistry + ".*" }
$loginServer = $acrList[1].Split(":")[1].Replace('"', '').Replace(',', '').Replace(' ', '')
$registryName = $acrList[2].Split(":")[1].Replace('"', '').Replace(',', '').Replace(' ', '')

$userName = $registryName
$password = ( az acr credential show --name $userName | ConvertFrom-Json).passwords.value.Split(" ")[1] 

Write-Host "loginServer: '$loginServer'"
Write-Host "registryName: '$registryName'"
Write-Host "userName: '$userName'"
Write-Host "userPassword: '$password'"

Write-Host "Step 1 - Creating Azure Container Registry done.`r`n"

Write-Host "Step 2 - Azure Kubernetes Service (AKS) ..."

$aksResult = az ad sp create-for-rbac --skip-assignment --name contosoretailsp$surfix"

Write-Host "$aksResult

$appid = ($aksResult | ConvertFrom-Json).appId
$displayName = ($aksResult | ConvertFrom-Json).displayName
$name = ($aksResult | ConvertFrom-Json).name
$aksPassword = ($aksResult | ConvertFrom-Json).password
$tenant = ($aksResult | ConvertFrom-Json).tenant

Write-Host "Step 2.1 - ServicePrincipal for Azure Kubernetes Service (AKS) created."

Write-Host "Step 2.2 - Creating Kubernetes Service Cluster ..."

# Create a Aks    
az aks create --name $kubernateservice `
    --resource-group $resourceGroupName `
    --location $location  `
    --kubernetes-version 1.17.13 `
    --node-vm-size Standard_D2_v2 `
    --node-count 1 `
    --service-principal "$appid" `
    --client-secret "$aksPassword" `
    --generate-ssh-keys 

Write-Host "kubernetes has been provisioned"

$registryRole = az acr show `
    --name $registryName `
    --resource-group $resourceGroupName `
    --query "id" `
    --output tsv

az role assignment create --assignee $appid --role Reader --scope $registryRole

Write-Host "Role assigned to $appid"

Write-Host "Step 2 - Kubernetes Service Cluster done.`r`n"

Write-Host "Step 3 - Create CosmosDB for Application."
# Create a MongoDB API Cosmos DB account with consistent prefix (Local) consistency and multi-master enabled
# az cosmosdb create `
#     --resource-group $resourceGroupName `
#     --name $azurecosmoaccount `
#     --kind MongoDB `
#     `
#     --default-consistency-level "ConsistentPrefix" `
#     --enable-multiple-write-locations false `
#     --subscription $subscriptionID

$connectionString = az cosmosdb keys list `
    --type connection-strings `
    --name $azurecosmoaccount `
    --resource-group $resourceGroupName `
    --query "connectionStrings[?contains(description, 'Primary SQL Connection String')].[connectionString]" -o tsv

((Get-Content -path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.ProductManagement.Host\appsettings.json.temp -Raw) -replace '{connectionstring}', $connectionString) | Set-Content -Path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.ProductManagement.Host\appsettings.json
((Get-Content -path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.UserProfile.Host\appsettings.json.temp -Raw) -replace '{connectionstring}', $connectionString) | Set-Content -Path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.UserProfile.Host\appsettings.json

$connectionURL = $connectionString.split(";")[0].Replace("AccountEndpoint=", "")
((Get-Content -path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.PurchaseHistory.Host\appsettings.json.temp -Raw) -replace '{connectionURL}', $connectionURL) | Set-Content -Path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.PurchaseHistory.Host\appsettings.json
((Get-Content -path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.RecommendationByUser.Host\appsettings.json.temp -Raw) -replace '{connectionURL}', $connectionURL) | Set-Content -Path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.RecommendationByUser.Host\appsettings.json

$accessKey = $connectionString.split(";")[1].Replace("AccountKey=", "")
((Get-Content -path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.PurchaseHistory.Host\appsettings.json -Raw) -replace '{accessKey}', $accessKey) | Set-Content -Path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.PurchaseHistory.Host\appsettings.json
((Get-Content -path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.RecommendationByUser.Host\appsettings.json -Raw) -replace '{accessKey}', $accessKey) | Set-Content -Path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.RecommendationByUser.Host\appsettings.json

((Get-Content -path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.RecommendationByItem.Host\appsettings.json.temp -Raw) -replace '{RecommendMLServiceURL}', $recommendMLServiceURL) | Set-Content -Path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.RecommendationByItem.Host\appsettings.json
((Get-Content -path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.RecommendationByItem.Host\appsettings.json -Raw) -replace '{RecommendMLServiceBearerToken}', $recommendMLServiceBearerToken) | Set-Content -Path .\Contoso.Retail.NextGen\src\Contoso.Retail.NextGen.RecommendationByItem.Host\appsettings.json




Write-Host "Step 3 - CosmosDB settings for Application finished.`r`n"

# Write-Host "Step 4 - Create Storage Account for Application."
# # Create a Storage  account 
# az storage account create `
#     --location $location `
#     --name $storageAccountName `
#     --resource-group $resourceGroupName `
#     --sku "Standard_LRS" `
#     --subscription $subscriptionID

# Write-Host "Step 4 - Storage Account for Application created.`r`n"    

cd ".\Contoso.Retail.NextGen\src"

docker build -f .\Contoso.Retail.NextGen.ProductManagement.Host\Dockerfile --rm -t 'microsoft/contosoretail/productapi' .
docker build -f .\Contoso.Retail.NextGen.UserProfile.Host\Dockerfile --rm -t 'microsoft/contosoretail/userprofile' .
docker build -f .\Contoso.Retail.NextGen.PurchaseHistory.Host\Dockerfile --rm -t 'microsoft/contosoretail/purchasehistory' .
docker build -f .\Contoso.Retail.NextGen.RecommendationByUser.Host\Dockerfile --rm -t 'microsoft/contosoretail/recommendationbyuser' .
docker build -f .\Contoso.Retail.NextGen.RecommendationByItem.Host\Dockerfile --rm -t 'microsoft/contosoretail/recommendationbyitem' .

docker tag 'microsoft/contosoretail/productapi' "$registryName.azurecr.io/microsoft/contosoretail/productapi"
docker tag 'microsoft/contosoretail/userprofile' "$registryName.azurecr.io/microsoft/contosoretail/userprofile"
docker tag 'microsoft/contosoretail/purchasehistory' "$registryName.azurecr.io/microsoft/contosoretail/purchasehistory"
docker tag 'microsoft/contosoretail/recommendationbyuser' "$registryName.azurecr.io/microsoft/contosoretail/recommendationbyuser"
docker tag 'microsoft/contosoretail/recommendationbyitem' "$registryName.azurecr.io/microsoft/contosoretail/recommendationbyitem"

Write-Host "Login to ACS `r`n"
docker login "$registryName.azurecr.io" -u $userName -p $password

Write-Host "Push Images to ACS`r`n"
docker push "$registryName.azurecr.io/microsoft/contosoretail/productapi"
docker push "$registryName.azurecr.io/microsoft/contosoretail/userprofile"
docker push "$registryName.azurecr.io/microsoft/contosoretail/purchasehistory"
docker push "$registryName.azurecr.io/microsoft/contosoretail/recommendationbyuser"
docker push "$registryName.azurecr.io/microsoft/contosoretail/recommendationbyitem"


cd ..\..

# Set Kubernets context
az aks get-credentials -g $resourceGroupName -n $kubernateservice

Write-Host "Preparing Kubernetes Deployment.....`r`n"

#Set up Deployment yaml file to deploy APIs
((Get-Content -path .\deployServicesToK8s.yaml.template -Raw) -replace '{acrname}', $registryName) | Set-Content -Path .\deployServicesToK8s.yaml

Write-Host "Deploy Services from ACR to Kubernetes.....`r`n"

#Deploy Containers to Kubernetes

kubectl apply -f .\deployServicesToK8s.yaml

Write-Host "Installing Ingress Controller in Kubernetes.....`r`n"

kubectl create namespace cert-manager

Write-Host "Installing cert-manager in Kubernetes.....`r`n"

#Install cert-manager
helm repo add jetstack https://charts.jetstack.io
helm repo update

helm install `
    cert-manager jetstack/cert-manager `
    --namespace cert-manager `
    --version v0.15.0 `
    --set ingressShim.defaultIssuerName=letsencrypt-prod `
    --set ingressShim.defaultIssuerKind=ClusterIssuer `
    --set ingressShim.defaultIssuerGroup=cert-manager.io `
    --set installCRDs=true



#Install Nginx Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.41.2/deploy/static/provider/cloud/deploy.yaml

# kubectl create namespace ingress-nginx
# kubectl label namespace ingress-nginx cert-manager.io/disable-validation=true

# helm repo add stable https://kubernetes-charts.storage.googleapis.com/
# helm install nginx stable/nginx-ingress `
#     --namespace ingress-nginx `
#     --set controller.replicaCount=2 `
#     --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux `
#     --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux 
    




Write-Host "First Deployment has been completed....."

kubectl get pods -A --watch

