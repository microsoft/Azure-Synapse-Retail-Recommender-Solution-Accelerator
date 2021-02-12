// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface IProductDetailsAPI {
    items: IProductDetails[]
}

export interface IProductDetails {
    id: string,
    productID: string,
    productCategory: string,
    brand: string,
    imageURL: string,
    price: number,
    name: string,
    description: string
}