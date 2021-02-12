// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import '../Recommendations/Recommendations.css';
import { Icon } from '@fluentui/react/lib/Icon';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Shimmer, ShimmerElementType } from 'office-ui-fabric-react/lib/Shimmer';
import { IRecommendedProducts, IProductItem } from '../../interfaces/IRecommendedItems';
import AddToCart from '../../helpers/AddToCart';
import { ISessionData } from '../../interfaces/ISessionData';
import { getProductDetails, getUserRecommendations } from '../../config';
import { STORAGE_ACCOUNT } from "../../config";

interface IProps {
  UsesVerticalLayout?: boolean
}

interface IState {
  recommendedItems: IProductItem[];
  IsLoaded: boolean;
  UserID: string;
  UsesVerticalLayout?: boolean
}

class PurchaseHistory extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    let userData: ISessionData = JSON.parse(sessionStorage.getItem("ContosoSynapseDemo"));

    this.state = {
      IsLoaded: false,
      UserID: userData.id,
      recommendedItems: [
        {
          id: "",
          brand: "",
          name: "",
          price: 0.00,
          description: "",
          imageURL: "",
          productCategory: "",
          productID: ""
        }
      ]
    };
    this.loadRecommendedItems = this.loadRecommendedItems.bind(this);

    // Get Data
    this.loadRecommendedItems();
  }

  componentDidMount() {
    if (this.props.UsesVerticalLayout) {
      this.setState({ UsesVerticalLayout: true});
    } else {
      this.setState({ UsesVerticalLayout: false});
    }
  }
  /**
   * Load Product Data.
   */
  async loadRecommendedItems() {
    console.info("Starting Orders Load");
    const that = this;
    let _data;
    let updatedData: IProductItem[] = [];
    let userData: ISessionData = JSON.parse(sessionStorage.getItem("ContosoSynapseDemo"));

    const URI = getUserRecommendations(userData.id);

    const _response = await fetch(URI)
      .then(function (response) {
        return response.json();
      })
      .then(function (parsedData: IRecommendedProducts) {
        // data here
        for (let i = 0; i < parsedData.items.length; i++) {
          const element = parsedData.items[i];
          const _response2 = fetch(getProductDetails(element.productID))
          .then(function (response) {
            return response.json();
          })
          .then(function (parsedDetailData: IProductItem) {
            updatedData.push(parsedDetailData);
            that.setState({
              recommendedItems: updatedData
            });
          });
        }
      }).finally(function() {
        that.setState({
          IsLoaded: true
        });
      });
  }

  render() {
    if (this.state.IsLoaded) {
      return (
        <div className={ this.props.UsesVerticalLayout ? "stack-wrapper stack-vertical" : "stack-wrapper"}>
          <Stack horizontal={!this.props.UsesVerticalLayout}
            horizontalAlign="start"
            verticalAlign="start"
            tokens={{ childrenGap: this.props.UsesVerticalLayout ? 20 : 0 }}
            wrap={this.props.UsesVerticalLayout}>
            {
              this.state.recommendedItems.map((item: IProductItem, index) => (
                <Stack.Item 
                  grow
                  key={index}
                  className={"product_" + item.productID}>
                  <div className="product-panel"
                  >
                    <a href={"/ProductDetail/" + item.productID}>
                      <Image
                        style={{ borderTopLeftRadius: "5pt", borderTopRightRadius: "5pt"}}
                        imageFit={ImageFit.cover}
                        alt={item.name}
                        src={item.imageURL}
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
                          <button type="button" className="add-to-cart-btn" onClick={() => AddToCart(item.productID.toString(), item.name, item.brand, item.productCategory, `https://${STORAGE_ACCOUNT}.blob.core.windows.net/product/` + item.productCategory + "/" + item.imageURL, item.price.toString(), 1)}>
                            <Icon iconName="Add" ariaLabel="Add to cart" color="white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Stack.Item>
              ))
            }
            </Stack>
          </div>
      );
    } else {
      return(
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
                      <Shimmer width="45%" styles={{ root: { margin: "20px 0" }}} />
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

export default PurchaseHistory;