# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

#login to azure 
Write-Host "Login to Azure"
az login 


#set parameters 
$subscriptionId = Read-Host "subscription Id"
$resource_group = Read-Host "resource group name"
$resource_name = Read-Host "unique name"
$synapseUser = Read-Host "username for Azure Synapse" 
$password = Read-Host "password for Azure Synapse"
$synapsepassword = ConvertTo-SecureString $password -AsPlainText -Force
$user = New-Object System.Management.Automation.PSCredential ($synapseUser, $synapsepassword)
$location = Read-Host "location"

Write-Host "creating resource group"
az group create --location $location --name $resource_group --subscription $subscriptionId 

$workspace_name = $resource_name + "ws"
$storage_account = $resource_name + "storage"
$file_system = $resource_name + "container"

Write-Host "creating data lake storage account"
az storage account create --name $storage_account --resource-group $resource_group --enable-hierarchical-namespace true

Write-Host "creating container in storage account"
az storage container create --name $file_system --account-name $storage_account

Write-Host "installing the Azure CLI for Azure Synapse"
Install-Module -Name Az.Synapse -RequiredVersion 0.1.0
Import-Module Az.Synapse

Write-Host "creating synapse workspace" 
az synapse workspace create --resource-group $resource_group `
                            --name $workspace_name --location $location `
                            --file-system $file_system --sql-admin-login-user $synapseUser `
                            --sql-admin-login-password $password `
                            --storage-account $storage_account

$spark_pool = $resource_name + "sp"
 
Write-Host "creating Spark pool"
az synapse spark pool create --name $spark_pool `
                            --node-count 3 `
                            --node-size Medium `
                            --resource-group $resource_group `
                            --spark-version 2.4 `
                            --workspace-name $workspace_name

$file_path = Read-Host "Local location of the Kaggle Datasets"
Write-Host "uploading the dataset to the storage account"
az storage blob upload-batch --destination $file_system --source $file_path --account-name $storage_account --destination-path "synapse/workspaces/"

$cosmos_db_account_name = Read-Host "Azure Cosmos DB Desired Account Name"
Write-Host "Creating the Azure Cosmos DB"
az cosmosdb create --name $cosmos_db_account_name --resource-group $resource_group

#adding Tag
az deployment group create --resource-group $resource_group --subscription $subscriptionId  --template-file .\azuredeploy.json