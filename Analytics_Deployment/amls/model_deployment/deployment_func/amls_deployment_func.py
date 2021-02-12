# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

import sys, os, io, time, base64, json, pickle
from azureml.core import Workspace, Model
from azureml.core.model import InferenceConfig
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core.authentication import ServicePrincipalAuthentication
from azureml.core.webservice import AksWebservice, Webservice
from azureml.core.compute import AksCompute, ComputeTarget
from azureml.core.compute_target import ComputeTargetException


def connectToWorkspace (tenant_id, service_principal_id, service_principal_password, subscription_id, resource_group, workspace_name):
    svc_pr = ServicePrincipalAuthentication(
            tenant_id=tenant_id,
            service_principal_id=service_principal_id,
            service_principal_password=service_principal_password)

    ws = Workspace(subscription_id=subscription_id,
                    resource_group=resource_group,
                    workspace_name=workspace_name,
                    auth=svc_pr)
    print("Found workspace {}, authentication successful.".format(ws.name))

    return ws




def attachAksComputeToWorkspace(ws, resource_group, cluster_name, name_for_compute_in_amls, is_dev=False):
    if is_dev:
        attach_config = AksCompute.attach_configuration(resource_group = resource_group,
                                                        cluster_name = cluster_name,
                                                        cluster_purpose = AksCompute.ClusterPurpose.DEV_TEST)
        print(attach_config)
    else:
        # Attach the cluster to your workgroup. If the cluster has less than 12 virtual CPUs, use the following instead:

        attach_config = AksCompute.attach_configuration(resource_group = resource_group,
                                                        cluster_name = cluster_name)


    aks_target = ComputeTarget.attach(ws, name_for_compute_in_amls, attach_config)
    print("AKS Compute Attached to Workspace")
    return aks_target

def deployToAks (ws, aks_target, web_service_name, model_obj, inference_config, is_dev=False, cpu_cores=1, memory_gb=1):
    deployment_config = AksWebservice.deploy_configuration(cpu_cores = cpu_cores, memory_gb = memory_gb)
    service = Model.deploy(ws, web_service_name, [model_obj], inference_config, deployment_config, aks_target)
    service.wait_for_deployment(show_output = True)
    print(service.state)
    print(service.get_logs())

    

