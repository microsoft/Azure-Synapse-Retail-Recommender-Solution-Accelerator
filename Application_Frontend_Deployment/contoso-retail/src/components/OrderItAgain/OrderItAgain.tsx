// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import '../OrderItAgain/OrderItAgain.css';
import { Icon } from '@fluentui/react/lib/Icon';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import AddToCart from '../../helpers/AddToCart';
import { ISessionData } from '../../interfaces/ISessionData';

interface IProps {
  UsesVerticalLayout?: boolean
}

interface IState {
  UsesVerticalLayout?: boolean,
  PastOrders: ISessionData
}

class OrderItAgain extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    let userData: ISessionData = JSON.parse(sessionStorage.getItem("ContosoSynapseDemo"));

    this.state = {
      PastOrders: userData
    }
  }

  componentDidMount() {
    if (this.props.UsesVerticalLayout) {
      this.setState({ UsesVerticalLayout: true});
    } else {
      this.setState({ UsesVerticalLayout: false});
    }
  }

  

  render() {
      return (
        <div id="OrderItAgain"
        style={{ display: this.state.PastOrders.orders.length > 0 ? "block" : "none" }}
        >
          <Stack className="title-area" 
        horizontal verticalFill horizontalAlign="space-between">
          <h2>Order It Again</h2>
          <a href="/OrderHistory">View Your Orders</a>
        </Stack>
        <div className={ this.props.UsesVerticalLayout ? "stack-wrapper stack-vertical" : "stack-wrapper"}>
          <Stack horizontal={!this.props.UsesVerticalLayout}
            horizontalAlign="start"
            verticalAlign="start"
            tokens={{ childrenGap: this.props.UsesVerticalLayout ? 20 : 0 }}
            wrap={this.props.UsesVerticalLayout}>
            {
              this.state.PastOrders.orders.map((item, index) => (
                <Stack.Item 
                  grow
                  key={index}
                  className={"product_" + item.id}>
                  <div className="product-panel"
                  >
                    <a href={"/ProductDetail/" + item.id}>
                      <Image
                        style={{ borderTopLeftRadius: "5pt", borderTopRightRadius: "5pt"}}
                        imageFit={ImageFit.cover}
                        alt={item.name}
                        src={item.image_src}
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
                        <div className="price">{"$" + item.price.slice(0, -2)}<sup>{item.price.slice(-2)}</sup></div>
                        <div style={{ textAlign: "center", display: "inline-block" }}>
                          <button type="button" className="add-to-cart-btn" onClick={() => AddToCart(item.id.toString(), item.name, item.brand, item.category, item.image_src, item.price, 1)}>
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
        </div>
        
      )
    } 

   
  }

export default OrderItAgain;