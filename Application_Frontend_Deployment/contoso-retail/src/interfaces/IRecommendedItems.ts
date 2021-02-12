// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface IRecommendedProducts {
    "user_id": number;
    "items": IProductItem[];
}

  export interface IProductItem {
    id: string;
    productID: string;
    productCategory: string;
    name: string;
    brand: string;
    description: string;
    price: number;
    imageURL: string;
  }