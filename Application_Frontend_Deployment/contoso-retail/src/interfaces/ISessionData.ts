// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface ISessionData {
    id: string,
    userName: string,
    userImg: string,
    cart: ICartOrders[],
    orders: ICartOrders[]
}

interface ICartOrders {
    id: string,
    name: string,
    brand: string,
    category: string,
    description: string,
    image_src: string,
    price: string,
    itemQty: number
}