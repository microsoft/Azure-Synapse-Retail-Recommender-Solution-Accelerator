// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import Recommendations from '../Recommendations/Recommendations';
import { EventSender } from '../EventSender/EventSender';

const h1Styles: React.CSSProperties = {
    font: "normal 20px/48px 'Segoe UI', Arial, Helvetica, sans-serif",
    letterSpacing: 0,
    color: "#16181A"
}

class RecommendedForYou extends React.Component<{}, {}> {

    constructor(props: any) {
        super(props);
        this.sendToEventHub();
    }


    private async sendToEventHub() {
        let key = "ContosoSynapseDemo";
        let storeData = JSON.parse(sessionStorage.getItem(key));
        var eventClient = new EventSender();
        await eventClient.SendEvent({ 
            "userID": storeData.id, 
            "httpReferer": window.location.href,
            "product_id": null,
            "brand": null,
            "price": null,
            "category_id": null,
            "category_code": null,
            "user_session": null
        });
    }

    render() {
        return(
            <div className="stack-wrapper hero">
             <h1 style={h1Styles}>Recommended For You</h1> 
            <Recommendations />
          </div>
        )
    }
}

export default RecommendedForYou;