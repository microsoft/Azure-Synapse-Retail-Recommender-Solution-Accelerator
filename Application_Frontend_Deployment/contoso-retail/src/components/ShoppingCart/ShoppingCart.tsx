// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import { PrimaryButton, Stack, Image, ImageFit, labelProperties, Label } from '@fluentui/react';
import { SpinButton } from 'office-ui-fabric-react/lib/SpinButton';
import '../ShoppingCart/ShoppingCart.scss';
import { ISessionData } from '../../interfaces/ISessionData';
import { EventSender } from '../EventSender/EventSender';
import Recommendations from '../Recommendations/Recommendations';
import ItemRecommendations from '../ItemRecommendations/ItemRecommendations';

class ShoppingCart extends React.Component<{}, {
    subtotal: number,
    taxAmount: number,
    total: number,
    cartData: ISessionData
}> {
    
    constructor(props: any) {
        super(props);

        // Bind functions
        this.updateTaxTotals = this.updateTaxTotals.bind(this);
        this.placeOrder = this.placeOrder.bind(this);

        let key = "ContosoSynapseDemo";
        let storeData: ISessionData = JSON.parse(sessionStorage.getItem(key));

        this.state = {
            subtotal: 0,
            taxAmount: 0,
            total: 0,
            cartData: storeData
        }
    }

    componentDidMount() {
        this.updateTaxTotals();
    }

    /**
     * Dynamically updates tax totals for the UI.
     */
    private updateTaxTotals() {
        var promise = new Promise((resolve, reject) => {
            let _subTotalPrice = 0;
            
            this.state.cartData.cart.forEach(item => {
                _subTotalPrice += Number(item.price) * item.itemQty;
            });

            let _taxRate = .07;
            let _taxAmount = _subTotalPrice * _taxRate;
            let _totalAmount = _subTotalPrice + _taxAmount;
            this.setState({
                subtotal: _subTotalPrice,
                taxAmount: _taxAmount,
                total: _totalAmount
            });
        });
        return promise;
    }

    /**
     * Saves the order to the ORDERS property object in the session store.
     */
    private async placeOrder() {
        let userData: ISessionData = JSON.parse(sessionStorage.getItem("ContosoSynapseDemo"));

        userData.orders = this.state.cartData.cart;
        userData.cart = [];

        sessionStorage.setItem("ContosoSynapseDemo", JSON.stringify(userData));

        let key = "ContosoSynapseDemo";
        let storeData = JSON.parse(sessionStorage.getItem(key));
        var eventClient = new EventSender();
        await eventClient.SendEvent({ 
            "userID": storeData.id, 
            "httpReferer": window.location.href,
            "product_id": this.state.cartData.cart[0].id,
            "brand": this.state.cartData.cart[0].brand,
            "price": this.state.cartData.cart[0].price,
            "category_id": this.state.cartData.cart[0].category,
            "category_code": this.state.cartData.cart[0].category,
            "user_session": null
        });

        window.alert("Order Submitted");

        window.location.href = "/";


    }

    render() {
        return (
            <div id="ShoppingCart">
                <h2 className="cart-title">My Cart</h2>
                <section>
                    <div style={{ display: this.state.cartData.cart.length === 0 ? "block" : "none"}}>
                        <Label>No items in cart.</Label>
                    </div>
                    <table style={{ width: "100%", border: "0 none" }} cellPadding="0" cellSpacing="2">
                        <tbody>
                            {
                                this.state.cartData.cart.map((item, index) =>
                                    <tr
                                        key={index}
                                        className="cart-item">
                                        <td style={{ width: "50%" }}>
                                            <Stack horizontal tokens={{ childrenGap: 5 }}>
                                                <Image
                                                    imageFit={ImageFit.none}
                                                    width="38px"
                                                    src={item.image_src}
                                                    alt={item.name}
                                                    style={{ width: "100%", borderRadius: "2pt" }}
                                                />
                                                <Stack horizontalAlign="start">
                                                    <div className="product-name">{item.name}</div>
                                                    <div className="brand-name">{"By " + item.brand}</div>
                                                </Stack>
                                            </Stack>
                                        </td>
                                        <td style={{ width: "25%" }}>
                                            <SpinButton
                                                className="qty-result"
                                                styles={{ root: { width: "25px" } }}
                                                value={item.itemQty.toString()}
                                                min={0}
                                                max={1000}
                                                step={1}
                                                label="Quantity:"
                                                ariaLabel={"Update quantity for " + item.name}
                                                ariaValueText={item.itemQty.toString()}
                                                ariaPositionInSet={index}
                                                ariaValueNow={item.itemQty}
                                                onBlur={(event) => {
                                                    if (event.currentTarget.value.toUpperCase() === event.currentTarget.value.toLowerCase()) {
                                                        item.itemQty = Number(event.currentTarget.value);
                                                        this.updateTaxTotals();
                                                    } else {
                                                        event.currentTarget.value = item.itemQty.toString();
                                                    }
                                                }}
                                                onIncrement={(event) => {
                                                    item.itemQty += 1;
                                                    this.updateTaxTotals();
                                                }}
                                                onDecrement={(event) => {
                                                    if (item.itemQty !== 0) {
                                                        item.itemQty -= 1;
                                                        this.updateTaxTotals();
                                                    }
                                                }}
                                                incrementButtonAriaLabel={'Increase quantity by 1'}
                                                decrementButtonAriaLabel={'Decrease quantity by 1'}
                                            />
                                        </td>
                                        <td style={{ width: "33%", textAlign: "right" }}>
                                            <div className="item-price">
                                                {"$" + (Number(item.price) * item.itemQty).toFixed(2)}
                                            </div>
                                        </td>
                                    </tr>

                                )
                            }
                        </tbody>
                    </table>
                </section>
                <section>
                    <Stack
                        tokens={{ childrenGap: 10 }}
                        className="price-breakdown"
                        horizontalAlign="end">
                        <Stack horizontal verticalAlign="end" tokens={{ childrenGap: 10 }}>
                            <div>Subtotal</div>
                            <div className="subtotal-result">{"$" + this.state.subtotal.toFixed(2)}</div>
                        </Stack>
                        <Stack horizontal verticalAlign="end" tokens={{ childrenGap: 10 }}>
                            <div>Shipping&nbsp;&nbsp;</div>
                            <div>Free</div>
                        </Stack>
                        <Stack horizontal verticalAlign="end" tokens={{ childrenGap: 10 }}>
                            <div>Tax (7%)</div>
                            <div className="tax-result">{"$" + this.state.taxAmount.toFixed(2)}</div>
                        </Stack>
                    </Stack>
                </section>
                <section>
                    <Stack
                        className="total-area"
                        verticalFill={true}
                        verticalAlign="center"
                        horizontal
                        horizontalAlign="space-between">
                        <div>Total</div>
                        <div className="total-result">{"$" + this.state.total.toFixed(2)}</div>
                    </Stack>
                    <PrimaryButton
                        disabled={this.state.cartData.cart.length === 0}
                        onClick={this.placeOrder}
                        className="PaymentButton"
                    >Place Order</PrimaryButton>
                </section>
                <div style={{ display: this.state.cartData.cart.length === 0 ? "none" : "block"}}>
                    <h2>Recommendations Based On Your Cart</h2>
                    {
                        this.state.cartData.cart.length === 0 ?
                        <Recommendations /> :
                        <ItemRecommendations ProductID={Number(this.state.cartData.cart[0].id)} />
                    }
                </div>
                <br /><br />
            </div>
        )
    }
}

export default ShoppingCart;
