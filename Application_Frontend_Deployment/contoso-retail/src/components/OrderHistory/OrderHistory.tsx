// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import '../OrderHistory/OrderHistory.scss';
import { Stack, IconButton, Image, ImageFit } from '@fluentui/react';
import { ISessionData } from '../../interfaces/ISessionData';
import { EventSender } from '../EventSender/EventSender';

let orderData: ISessionData = JSON.parse(sessionStorage.getItem("ContosoSynapseDemo"));

class OrderHistory extends React.Component<{
    userData: ISessionData
}, {}> {
    constructor(props: any) {
        super(props);

        this.state = {
            userData: orderData
        }
        this.sendToEventHub();
    }

    /**
     * Send to Event Hub for user tracking.
     */
    private async sendToEventHub() {
        let key = "ContosoSynapseDemo";
        let storeData = JSON.parse(sessionStorage.getItem(key));
        var eventClient = new EventSender();
        await eventClient.SendEvent({ "userID": storeData.id, "httpReferer": window.location.href });
    }

    /**
     * Load Order details view.
     */
    private viewOrderDetails(id: string) {
        window.location.href = "/OrderDetail/" + id;
    }

    render() {
        return (
            <div id="OrderHistory">
                <h1>Orders</h1>
                <h2>Current</h2>
                <section>
                {
                    orderData.cart.length === 0 &&
                    <h2>No orders available</h2>
                }
                {
                        orderData.cart.map((item, index) => 
                            <div className="order-item" key={item.id}
                            onClick={() => this.viewOrderDetails(item.id)}
                            >
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack horizontal tokens={{ childrenGap: 10 }}>
                                        <Image
                                            imageFit={ImageFit.centerCover}
                                            src={item.image_src}
                                            alt={item.name}
                                            styles={{
                                                root: {
                                                    width: 30, height: 30,
                                                    backgroundColor: "#1a1a1a",
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                        <Stack horizontalAlign="start">
                                            <div className="product-name">{item.name}</div>
                                        <div className="brand-name">{"By " + item.brand}</div>
                                        </Stack>
                                    </Stack>
                                    <IconButton 

                                        ariaHidden={true}
                                        ariaDescription={"Button to navigate to " + item.name}
                                        iconProps={{ iconName: "ChevronRight" }}
                                        ariaLabel={"View order history for: " + item.name}
                                    />
                                </Stack>
                            </div>
                        )
                    }
                </section>

                <h2 style={{ marginTop: "20pt" }}>Past</h2>
                <section>
                    {
                        orderData.orders.length === 0 &&
                        <h2>No orders available</h2>
                    }
                    {
                        orderData.orders.map((item, index) => 
                            <div className="order-item" key={item.id}
                            onClick={() => this.viewOrderDetails(item.id)}
                            >
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack horizontal tokens={{ childrenGap: 10 }}>
                                        <Image
                                            imageFit={ImageFit.centerCover}
                                            src={item.image_src}
                                            alt={item.name}
                                            styles={{
                                                root: {
                                                    width: 30, height: 30,
                                                    backgroundColor: "#1a1a1a",
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                        <Stack horizontalAlign="start">
                                            <div className="product-name">{item.name}</div>
                                        <div className="brand-name">{"By " + item.brand}</div>
                                        </Stack>
                                    </Stack>
                                    <IconButton 
                                        iconProps={{ iconName: "ChevronRight" }}
                                    
                                    />
                                </Stack>
                            </div>
                        )
                    }
                </section>
            </div>
        );
    }

}

export default OrderHistory;