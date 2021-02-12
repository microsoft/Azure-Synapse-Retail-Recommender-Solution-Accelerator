// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export default interface IShoppingCart {
    user_id: number,
    items: IShoppingCartItem[]
}

interface IShoppingCartItem {
    id: number,
    productName: string,
    productBrandName: string,
    productImageHref: string,
    price: number,
    qty: number
}