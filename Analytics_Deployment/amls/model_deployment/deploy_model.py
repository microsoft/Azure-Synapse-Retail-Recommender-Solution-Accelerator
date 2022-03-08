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
WORKSPACE_NAME=""
AKS_CLUSTER_NAME=""

def main ():
      ws = Workspace.get(name=WORKSPACE_NAME, subscription_id=SUBSCRIPTION_ID, resource_group=RESOURCE_GROUP)
      
      print("connect")
  
      model = Model.register(model_path = os.path.join(os.getcwd(), "retailai_recommendation_model.zip"), 
                       model_name = "retailai_recommendation_model", 
                       description = "Retail.AI Item-Based Recommender",
                       workspace = ws)
      print("model registered")
      
  
      myenv = Environment.from_conda_specification(name = 'myenv', file_path="environment.yml")
      myenv.docker.base_image = "mcr.microsoft.com/mmlspark/release"
      myenv.inferencing_stack_version = 'latest'
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
