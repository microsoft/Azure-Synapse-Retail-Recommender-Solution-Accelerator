# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

import os, json

from azureml.core.conda_dependencies import CondaDependencies
from azureml.core.environment import Environment
from azureml.core import Workspace
from azureml.core.model import Model, InferenceConfig

from deployment_func.amls_deployment_func import *

SUBSCRIPTION_ID=""
RESOURCE_GROUP=""
TENANT_ID=""
APP_ID=""
SP_PASSWORD=""
WORKSPACE_NAME=""
AKS_CLUSTER_NAME=""

def main ():
      try:
            ws = connectToWorkspace(TENANT_ID, APP_ID, SP_PASSWORD, SUBSCRIPTION_ID, RESOURCE_GROUP, WORKSPACE_NAME)
      except ProjectSystemException as err:
            print('Authentication did not work.')
            return json.dumps('ProjectSystemException')
      except Exception as err:
            print(err)
            sys.exit()
      print("connect")
      model = Model.register(model_path = os.path.join(os.getcwd(), "retailai_recommendation_model.zip"), 
                       model_name = "retailai_recommendation_model", 
                       description = "Retail.AI Item-Based Recommender",
                       workspace = ws)
      print("model registered")
      
      
      myenv = Environment.get(ws, name='AzureML-PySpark-MmlSpark-0.15')
      myenv.name = "myenv"
      conda_dep = CondaDependencies()
      conda_dep.add_pip_package("azureml-defaults")
      conda_dep.add_pip_package("azure-storage-file-datalake")
      myenv.python.conda_dependencies = conda_dep
      print("Environment Configured")
      inference_config = InferenceConfig(entry_script='score.py', environment=myenv)

      aks_target_name = AKS_CLUSTER_NAME

      try:
            aks_target = AksCompute(ws,aks_target_name)
            print(aks_target)
      except ComputeTargetException as err:
            aks_target = attachAksComputeToWorkspace(ws, RESOURCE_GROUP, AKS_CLUSTER_NAME, aks_target_name, True)
            print(aks_target)
      except Exception as err:
            print(err)
            sys.exit()
      try:
            deployToAks(ws, aks_target, "retail-ai-item-recommender", model, inference_config, True)
      except Exception as err:
            print(err)
            sys.exit()

if __name__ == "__main__":
    main()