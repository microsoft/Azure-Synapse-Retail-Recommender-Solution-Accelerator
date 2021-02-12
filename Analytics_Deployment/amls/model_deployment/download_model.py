# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

import os, uuid, sys, pickle, shutil, io, logging
from azure.storage.filedatalake import DataLakeServiceClient
from azure.core._match_conditions import MatchConditions
from azure.storage.filedatalake._models import ContentSettings
from utility_functions.az_storage_reader import *

# Enter the name of the Azure Data Lake Storage Gen2 Account
DATA_LAKE_NAME=""
# Enter the name of the filesystem
DATA_LAKE_FILE_SYSTEM_NAME=""
# Enter the Primary Key of the Data Lake Account
DATA_LAKE_PRIMARY_KEY=""

file_system_client = connect_to_adls(DATA_LAKE_NAME, DATA_LAKE_PRIMARY_KEY, DATA_LAKE_FILE_SYSTEM_NAME)
dirs_to_write = ["itemFactors", "metadata", "userFactors"]
prep_dirs_for_write(dirs_to_write, "retailai_recommendation_model")
for directory in dirs_to_write:
    copy_files_from_directory(file_system_client, "user/trusted-service-user/retailai_recommendation_model/"+directory, directory, "retailai_recommendation_model")

shutil.make_archive("retailai_recommendation_model", 'zip', "model\\retailai_recommendation_model")