# Building Machine Learning Models in Azure Synapse
In this folder, we mainly describe how to use Azure Synapse to build a recommendation model.

# Dataset

The dataset for this sample repository is public available through [this website](https://www.kaggle.com/mkechinov/ecommerce-behavior-data-from-multi-category-store).

Thanks to REES46 Marketing Platform for this dataset.

# Data Preparation

In the notebook `Clean_Training_Data`, we've cleaned the dataset for further training; You don't have to do this (all the code will still run), but we recommend doing so to reduce some of the computation cost.

# Model Training

## User based recommendation model and item based recommendation model
There are two model available for this sample repository: a user-based recommendation model, and a item-based recommendation model.

The difference is in how the similarity is computed. For user based recommendation, the similarity between users are computed, while for the item based recommender, the similarity between the items are computed.  The following image will make it even more clearer.

If you want to dive deeper in this topic, [this medium article](https://medium.com/@cfpinela/recommender-systems-user-based-and-item-based-collaborative-filtering-5d5f375a127f) might be a good reference.

## Collaborative Filtering
The model was trained using Spark's [Collaborative Filtering model](https://spark.apache.org/docs/latest/api/python/pyspark.ml.html#module-pyspark.ml.recommendation). To estimate the rating Matrix *R*, Alternating Least Squares (ALS) matrix factorization was used.

Also, since this dataset is for click data rather than actual ratings, it's actually implicit preference data. For implicit preference data, the algorithm used is based on [Collaborative Filtering for Implicit Feedback Datasets](http://dx.doi.org/10.1109/ICDM.2008.22), adapted for the blocked approach used here. Essentially, instead of finding the low-rank approximations to the rating matrix *R*, this finds the approximations for a preference matrix *P* where the elements of *P* are 1 if r > 0 and 0 if r <= 0. The ratings then act as 'confidence' values related to strength of indicated user preferences rather than explicit ratings given to items.

# Item-based recommendation model
In order to get an item-to-item recommendation model, we use the cosine distance to estimate how different items are similar to each other. This is done by first getting `model.itemFactors` from the already trained Collaborative Filtering model above, then compute cosine distance between different items. For more details, please refer to the `ItemBasedRecommender` class in the notebook.

