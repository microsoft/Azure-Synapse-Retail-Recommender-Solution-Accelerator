# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

import os, uuid, sys, pickle, shutil, logging, json
from io import BytesIO
from azure.storage.filedatalake import DataLakeServiceClient
from azure.core._match_conditions import MatchConditions
from azure.storage.filedatalake._models import ContentSettings
import pyspark
from pyspark.sql import SparkSession
from pyspark.ml.recommendation import ALSModel
from pyspark.ml.recommendation import ALS
from pyspark.sql import Row
from pyspark.sql.functions import col
from pyspark.ml.feature import  StringIndexer, IndexToString
import numpy as np
import os
from numpy import linalg as LA


def init():
    ## Add in your Data Lake Details Here
    ## The DATA_LAKE_NAME should be the attached Data Lake to your Synapse workspace where the saved ALS Model is
    ## DATA_LAKE_FILE_SYSTEM_NAME should be the filesystem that is attached to the Synapse workspace where the Model is saved
    ## DATA_LAKE_PRIMARY_KEY is the Primary Key of the Azure Data Lake Storage Gen2 that can be found in the portal
    DATA_LAKE_NAME=""
    DATA_LAKE_FILE_SYSTEM_NAME=""
    DATA_LAKE_PRIMARY_KEY=""

    import os, uuid, sys, pickle, shutil, io
    from azure.storage.filedatalake import DataLakeServiceClient
    from azure.core._match_conditions import MatchConditions
    from azure.storage.filedatalake._models import ContentSettings
    import pyspark
    from pyspark.sql import SparkSession
    from pyspark.ml.recommendation import ALSModel
    from pyspark.ml.recommendation import ALS
    from pyspark.sql import Row
    from pyspark.sql.functions import col
    from pyspark.ml.feature import  StringIndexer, IndexToString
    import numpy as np
    import os
    from numpy import linalg as LA

    global trainedModel
    global spark
    global labels
    global item_based_rec



    def copy_files_from_directory(file_system_client, target_adls_directory, sink_local_dir, model_name):
        print(f"Beginning Download of Files from {target_adls_directory}.")
        directory_client = file_system_client.get_directory_client(target_adls_directory)
        ## returns the paths to all the files in the target director in ADLS
        adls_paths = [file_path.name.split("/")[-1] for file_path in file_system_client.get_paths(path=target_adls_directory) if not file_path.is_directory][1:]
        ## need to generate list of local paths to write the files to
        local_paths = [os.path.normpath(os.getcwd()+f"/model/{model_name}/"+sink_local_dir+"/"+file_name) for file_name in adls_paths]
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

    class ItemBasedRecommender():
            def __init__(self, model, spark):
                self.model = model
                self.spark = spark
                self.itemFactors = self.model.itemFactors

            def compute_similarity(self, item_id):
                item = self.itemFactors.where(
                    col('id') == item_id).select(col('features'))
                item_features = item.rdd.map(lambda x: x.features).first()

                lol = []
                for row in self.itemFactors.rdd.toLocalIterator():
                    _id = row.__getattr__('id')
                    features = row.__getattr__('features')
                    similarity_score = self._cosine_similarity(features, item_features)
                    if _id != item_id:
                        lol.append([_id, similarity_score])

                R = Row('item_index', 'similarity_score')
                self.similar_items_df = self.spark.createDataFrame(
                    [R(col[0], float(col[1])) for col in lol])
                self.similar_items_df = self.similar_items_df.orderBy(
                    col('similarity_score').desc()).na.drop()
                return self.similar_items_df


            def _cosine_similarity(self, vector_1, vector_2):
                v1 = np.asarray(vector_1)
                v2 = np.asarray(vector_2)
                cs = v1.dot(v2) / (LA.norm(v1) * LA.norm(v2))
                return(cs)

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
            print(os.path.normpath(os.getcwd()+f"/{model_dir}/{model_name}/"+directory))
            if not os.path.exists(os.path.normpath(os.getcwd()+f"/{model_dir}/{model_name}/"+directory)):
                os.makedirs(os.path.normpath(os.getcwd()+f"/{model_dir}/{model_name}/"+directory))




    spark = pyspark.sql.SparkSession.builder.appName("Retail AI Item Based Recommender").getOrCreate()
    file_system_client = connect_to_adls(DATA_LAKE_NAME, DATA_LAKE_PRIMARY_KEY, DATA_LAKE_FILE_SYSTEM_NAME)
    dirs_to_write = ["itemFactors", "metadata", "userFactors"]
    prep_dirs_for_write(dirs_to_write, "retailai_recommendation_model")
    for directory in dirs_to_write:
        copy_files_from_directory(file_system_client, "user/trusted-service-user/retailai_recommendation_model/"+directory, directory, "retailai_recommendation_model")
    trainedModel = ALSModel.load("model/retailai_recommendation_model")
    item_based_rec = ItemBasedRecommender(trainedModel, spark)

def run(input_json):
    if isinstance(trainedModel, Exception):
        return json.dumps({{"trainedModel":str(trainedModel)}})
    try:
        sc = spark.sparkContext

        item_to_score = json.loads(input_json)["product_id"]
        print(item_to_score)
        ret_df = item_based_rec.compute_similarity(item_to_score).orderBy("similarity_score", ascending=False).select("item_index").limit(5)
        rec_obj = json.dumps({"related_products":[row[0] for row in ret_df.collect()]})

        return rec_obj

    except Exception as e:
        logging.error(e)
        result = str(e)
        return result