@REM Copyright (c) Microsoft Corporation.
@REM Licensed under the MIT license.

Powershell.exe -executionpolicy remotesigned -File ^
    Deploy1.ps1 ^
    --location "{put your data center location}" ^
    --subscriptionID "{put your subscriptionID for deployment}" ^
    --CertificateEamil "{put you real email address}" ^
    --existingresourceGroupName "{put your resource group name}" ^
    --existingstorageAccountName "{put your storage account name}" ^
    --existingcosmosDBName "{put your CosmosDB Name}" ^
    --recommendMLServiceURL "{put recommendation ml service endpoint URL from MLStudio}" ^
    --recommendMLServiceBearerToken "{put service BearerToken from MLStudio}"
