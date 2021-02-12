# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

import os, uuid, sys, pickle, shutil, io
from azure.storage.filedatalake import DataLakeServiceClient
from azure.core._match_conditions import MatchConditions
from azure.storage.filedatalake._models import ContentSettings


def connect_to_adls(acct_name, acct_key, fs):
    try:
        global service_client
        
        service_client = DataLakeServiceClient(account_url="{}://{}.dfs.core.windows.net".format(
            "https", acct_name), credential=acct_key)
        file_system_client = service_client.get_file_system_client(file_system=fs)
        return file_system_client
    except Exception as e:
        print(e)
        return e


def download_file_from_adls(file_system_client, dir_name, obj_name_to_write):
    try:
        directory_client = file_system_client.get_directory_client(dir_name)

        file_client = directory_client.get_file_client(f"{obj_name_to_write}.pkl")
    
        download = file_client.download_file()

        downloaded_bytes = download.readall()

        pickle.dump(downloaded_bytes, open(f"{obj_name_to_write}.pkl", "wb"))
        pkl_obj_to_return = pickle.load(BytesIO(pickle.load( open(f"{obj_name_to_write}.pkl", "rb"))))
        return pkl_obj_to_return
    except Exception as e:
        print(e)
        return e



def prep_dirs_for_write(dirs_to_write, model_name, model_dir="model"):
    for directory in dirs_to_write:
        print(os.path.normpath(os.getcwd()+f"\\{model_dir}\\{model_name}\\"+directory))
        if not os.path.exists(os.path.normpath(os.getcwd()+f"\\{model_dir}\\{model_name}\\"+directory)):
            os.makedirs(os.path.normpath(os.getcwd()+f"\\{model_dir}\\{model_name}\\"+directory))

def copy_files_from_directory(file_system_client, target_adls_directory, sink_local_dir, model_name):
    print(f"Beginning Download of Files from {target_adls_directory}.")
    directory_client = file_system_client.get_directory_client(target_adls_directory)
    ## returns the paths to all the files in the target director in ADLS
    adls_paths = [file_path.name.split("/")[-1] for file_path in file_system_client.get_paths(path=target_adls_directory) if not file_path.is_directory][1:]
    ## need to generate list of local paths to write the files to
    local_paths = [os.path.normpath(os.getcwd()+f"\\model\\{model_name}\\"+sink_local_dir+"\\"+file_name) for file_name in adls_paths]
    for idx, file_to_write in enumerate(adls_paths):
        try:
            print(f"Writing {file_to_write}...")
            local_file = open(local_paths[idx],'wb')
            file_client = directory_client.get_file_client(file_to_write)
            download = file_client.download_file()
            downloaded_bytes = download.readall()
            local_file.write(downloaded_bytes)
            local_file.close()
            print(f"Finished writing {file_to_write}. {len(adls_paths)-(idx+1)} left.")
        except Exception as e:
            print(e)
    print(f"Finished Download of Files from {target_adls_directory}.")