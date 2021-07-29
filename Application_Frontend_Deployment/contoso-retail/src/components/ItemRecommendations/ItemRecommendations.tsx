// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import { Icon } from '@fluentui/react/lib/Icon';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Shimmer, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';
import { IProductItem } from '../../interfaces/IRecommendedItems';
import AddToCart from '../../helpers/AddToCart';
import { ISessionData } from '../../interfaces/ISessionData';
import { getItemRecommendations } from '../../config';
import Recommendations from '../Recommendations/Recommendations';
import '../ItemRecommendations/ItemRecommendations.css';
import { STORAGE_ACCOUNT } from "../../config";

interface IProps {
  UsesVerticalLayout?: boolean,
  ProductID: number
}

interface IState {
  recommendedItems: IProductItem[];
  user_id: number;
  IsLoaded: boolean;
  UsesVerticalLayout?: boolean,
  ProductId: number
}

class ItemRecommendations extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    let userData: ISessionData = JSON.parse(sessionStorage.getItem("ContosoSynapseDemo"));

    this.state = {
      IsLoaded: false,
      UsesVerticalLayout: this.props.UsesVerticalLayout,
      ProductId: props.ProductID,
      user_id: Number(userData.id),
      recommendedItems: [{
        brand: "",
        imageURL: "",
        price: 0.00,
        productID: "",
        name: "",
        description: "",
        id: "",
        productCategory: ""
      }]
    };

    this.loadRecommendedItems = this.loadRecommendedItems.bind(this);

    // Get Data
    this.loadRecommendedItems();
  };
  
  async loadRecommendedItems() {
    
    let userData: ISessionData = JSON.parse(sessionStorage.getItem("ContosoSynapseDemo"));
    var _rItems: any;
    let that = this;

    //get recoomendation
    const URI = getItemRecommendations(this.state.ProductId);
    const _response = await fetch(URI)
      .then(function (response) {
        return response.json();
      })
      .then(function (parsedData: IProductItem[]) {
        // data here
        that.setState({
          recommendedItems: parsedData.filter((x) : x is IProductItem => x != null),
          IsLoaded: true
        })
      });

      this.setState({
        user_id: Number(userData.id)
      });
  }

  render() {
    if (this.state.IsLoaded) {
      return (
        <div className={this.props.UsesVerticalLayout ? "stack-wrapper item-recommendations stack-vertical" : "stack-wrapper item-recommendations"}>
          {
    this.state.recommendedItems.length === 0 ?
    <Recommendations /> :
    <Stack horizontal={!this.props.UsesVerticalLayout}
    horizontalAlign="start"
    verticalAlign="start"
    tokens={{ childrenGap: this.props.UsesVerticalLayout ? 20 : 0 }}
    wrap={this.props.UsesVerticalLayout}>
    {
      this.state.recommendedItems.map((item: IProductItem, index) =>
        <Stack.Item
          grow
          key={index}
          className={"product_" + item.productID}>
          <div className="product-panel"
          >
            <a href={"/ProductDetail/" + item.productID}>
              <Image
                style={{ borderTopLeftRadius: "5pt", borderTopRightRadius: "5pt" }}
                imageFit={ImageFit.cover}
                alt={item.name}
                src={`https://${STORAGE_ACCOUNT}.blob.core.windows.net/product/` + item.productCategory + "/" + item.imageURL}
              />
            </a>
            <div className="product-details">
              <div className="product-name" title={item.name}>
                {item.name}
              </div>
              <div className="brand-name" title={"By " + item.brand}>
                By {item.brand}
              </div>
              <div className="price-area">
                <div className="price">{"$" + item.price.toString().slice(0, -2)}<sup>{item.price.toString().slice(-2)}</sup></div>
                <div style={{ textAlign: "center", display: "inline-block" }}>
                  <button type="button" className="add-to-cart-btn" onClick={() => AddToCart(item.productID, item.name, item.brand, item.brand, `https://${STORAGE_ACCOUNT}.blob.core.windows.net/product/` + item.productCategory + "/" + item.imageURL, item.price.toString(), 1)}>
                    <Icon iconName="Add" ariaLabel="Add to cart" color="white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Stack.Item>
      )}
  </Stack>
  }
        </div>
      );
    } else {
      /* Load pre-loader UI while data is pulled from APIs. */
      return (
        <div className="stack-wrapper">
          <Stack horizontal
            horizontalAlign="start"
            wrap={false}>
            <Stack.Item grow
              className={"product_loading"}>
              <div className="product-panel">
                <a href="/ProductDetail">
                  <Shimmer width="100%" className="shimmer-image" />
                </a>
                <div className="product-details">
                  <Shimmer width="90%" />
                  <Shimmer width="45%" styles={{ root: { margin: "20px 0" } }} />
                  <div className="price-area">
                    <div className="price"><Shimmer width="30%" shimmerElements={[
                      { type: ShimmerElementType.line, height: 30 }
                    ]} /></div>

                  </div>
                </div>
              </div>
            </Stack.Item>
          </Stack>
        </div>
      );
    }


  }
}

export default ItemRecommendations;