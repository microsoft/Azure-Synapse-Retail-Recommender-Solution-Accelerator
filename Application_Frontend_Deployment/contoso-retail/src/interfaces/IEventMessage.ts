// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface IEventMessage extends IMessage {
    userID: string
}

interface IMessage {
    httpReferer : string,
    product_id?: string,
    category_id?: string,
    category_code?: string,
    brand?: string,
    price?: string,
    user_session?: string
}