// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface IRelatedProductsAPI {
    "related_products": IRelatedProductItem[]
}

export interface IRelatedProductItem {
    "id": string;
    "productID": string;
    "brand": string;
    "price": string;
    "name": string;
    "description": string;
    "productCategory": string;
    "imageURL": string;
}