// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Icon } from '@fluentui/react/lib/Icon';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import '../ProductDetail/ProductDetail.scss';
import { IProductDetails, IProductDetailsAPI } from '../../interfaces/IProductDetails';
import AddToCart from '../../helpers/AddToCart';
import { EventSender } from '../EventSender/EventSender';
import Recommendations from '../Recommendations/Recommendations';
import { getProductDetails } from '../../config';
import ItemRecommendations from '../ItemRecommendations/ItemRecommendations';
import { STORAGE_ACCOUNT } from "../../config";

class ProductDetail extends React.Component<{}, {
    _id?: string,
    _productData: IProductDetails
}>  {

    constructor(props: any) {
        super(props);

        if (props.match.params.id !== undefined) {
            this.state = {
                _id: props.match.params.id,
                _productData: {
                    id: "",
                    brand: "",
                    productCategory: "",
                    productID: "",
                    imageURL: "",
                    price: 0.00,
                    name: "",
                    description: ""
                }
            };

            this.loadData(props.match.params.id);

        }

        this.sendToEventHub = this.sendToEventHub.bind(this);
    }

    private async sendToEventHub() {
        let key = "ContosoSynapseDemo";
        let storeData = JSON.parse(sessionStorage.getItem(key));
        var eventClient = new EventSender();
        
        await eventClient.SendEvent({ 
            "userID": storeData.id, 
            "httpReferer": window.location.href,
            "product_id": this.state._id,
            "brand": this.state._productData.brand,
            "price": this.state._productData.price.toString(),
            "category_id": this.state._productData.productCategory,
            "category_code": this.state._productData.productCategory,
            "user_session": null
        });
    }

    async loadData(id: string) {
        const URI = getProductDetails(id);
        let _data;
        await fetch(URI)
            .then(function (response) {
                return response.json();
            })
            .then(function (parsedData: IProductDetailsAPI) {
                // data here
                _data = parsedData;
            });

        this.setState({ _productData: _data });
        
        this.sendToEventHub();
    }

    goBack() {
        window.history.back();
    }
    render() {
        return (
            <div id="ProductDetail">
                <div className="navigationBack">
                    <a onClick={this.goBack}><Icon
                        styles={{ root: { fontSize: "10px", fontWeight: "bold" } }}
                        iconName="ChevronLeft" /> Back</a>
                </div>
                <Image
                    className="detailImage"
                    imageFit={ImageFit.centerCover}
                    height="250px"
                    src={`https://${STORAGE_ACCOUNT}.blob.core.windows.net/product/` + this.state._productData.productCategory + "/" + this.state._productData.imageURL}
                    alt={this.state._productData.name}
                />
                <div className="product-details">
                    <div className="title-area">
                        <h2 className="product-name">
                            {this.state._productData.name}
                        </h2>
                        <div className="brand-name">
                            By {this.state._productData.brand}
                        </div>
                    </div>
                    <h3>What's in the box</h3>
                    <div className="product-description">
                        {this.state._productData.productCategory}
                    </div>
                    <div className="price-area">
                        <div id="priceDetail">
                            <div>
                                <div className="price">{"$" + this.state._productData.price.toString().slice(0, -2)}<sup>{this.state._productData.price.toString().slice(-2)}</sup></div>
                            </div>
                            <div>
                                <PrimaryButton
                                    onClick={() => AddToCart(this.state._productData.productID, this.state._productData.name, this.state._productData.brand, this.state._productData.productCategory, `https://${STORAGE_ACCOUNT}.blob.core.windows.net/product/` + this.state._productData.productCategory + "/" + this.state._productData.imageURL, this.state._productData.price.toString(), 1)}
                                    primary
                                    iconProps={{ iconName: "Add" }}
                                    text="Add"
                                    color="white" />
                            </div>
                        </div>
                    </div>
                    <div className="title-area">
                        <h2>You Might Also Like</h2>
                    </div>
                        {
                            this.state._id === undefined ?
                            <Recommendations /> :
                            <ItemRecommendations ProductID={Number(this.state._id)} />
                        }
                    </div>
                    <br /><br />
                </div>
        );
    }
}

export default ProductDetail;