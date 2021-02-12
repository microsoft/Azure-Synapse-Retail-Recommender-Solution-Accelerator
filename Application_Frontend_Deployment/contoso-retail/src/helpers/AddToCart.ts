// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EventSender } from "../components/EventSender/EventSender";
import { ISessionData } from "../interfaces/ISessionData";

/**
 * Add item to cart using Session Storage.
 * @param id Product ID
 * @param name Product Name
 * @param brand Product Brand Name
 * @param description Product Category
 * @param imgsrc Image URL
 * @param price Price of item
 * @param itemQty Quantity
 */
function AddToCart(id: string, name: string, brand: string, description: string, imgsrc: string, price: string, itemQty: number) {
    const cartLabel = document.getElementById("cartitems") as HTMLSpanElement;

    let key = "ContosoSynapseDemo";
    let storeData = JSON.parse(sessionStorage.getItem(key));

    storeData.cart.push({ "id": id, "name": name, 
    "brand": brand, "category": description, "image_src": imgsrc, "price": price, "itemQty": 1});
    
    cartLabel.innerText = storeData.cart.length;
    cartLabel.style.display = "inline-block";
    
    sessionStorage.setItem(key, JSON.stringify(storeData));

    let userData: ISessionData = JSON.parse(sessionStorage.getItem("ContosoSynapseDemo"));

    var eventClient = new EventSender();
    eventClient.SendEvent({ 
        "userID": userData.id, 
        "httpReferer": window.location.href,
        "product_id": id,
        "brand": brand,
        "price": price,
        "category_id": description,
        "category_code": description,
        "user_session": null
    });
}

export default AddToCart;