// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * Refresh UI on route change to update cart count.
 */
function UpdateCartCount() {
    let key = "ContosoSynapseDemo";
    const cartLabel = document.getElementById("cartitems") as HTMLSpanElement;
    let storeData = JSON.parse(sessionStorage.getItem(key));

    cartLabel.innerText = storeData.cart.length;
    if (storeData.cart.length > 0) {
        cartLabel.style.display = "inline-block";
    }
}

export default UpdateCartCount;