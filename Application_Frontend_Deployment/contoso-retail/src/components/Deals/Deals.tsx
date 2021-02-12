// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Image } from 'office-ui-fabric-react/lib/Image';
import { IconButton } from '@fluentui/react/lib/Button';
import { ImageFit } from '@fluentui/react';

const h1Styles: React.CSSProperties = {
    font: "normal 20px/48px 'Segoe UI', Arial, Helvetica, sans-serif",
    letterSpacing: 0,
    color: "#16181A"
}

const Deals: React.FunctionComponent = () => {
    return(
        <div className="stack-wrapper hero">
         <h1 style={h1Styles}>My Deals</h1> 
        <Stack 
          tokens={{ childrenGap: 20 }}
          wrap={false}>
          <Stack.Item grow>
            <div className="product-panel">
              <Image
                 style={{ borderTopLeftRadius: "5pt", 
                 borderTopRightRadius: "5pt",
                  backgroundColor: 'teal'
                }}
                alt="Contoso Club Members Take An Extra 10%"
                imageFit={ImageFit.cover}
                src={`${process.env.PUBLIC_URL}/assets/SUR18_Holiday_Contextual_2136_RGB.jpg`}
              />
              <div className="catagory-details">
                <div className="catagory-name">
                  DEALS &amp; REWARDS
                    </div>
                <Stack horizontal horizontalAlign="space-between">
                  <p>Contoso Club Members Take An Extra 10%</p>
                  <IconButton iconProps={{ iconName: 'SingleBookmark' }} ariaLabel="Add Bookmark" />
                </Stack>
              </div>
            </div>
          </Stack.Item>

          <Stack.Item grow>
            <div className="product-panel">
              <Image
                style={{ 
                  backgroundColor: 'greenyellow',
                  borderTopLeftRadius: "5pt", borderTopRightRadius: "5pt"}}
                alt="Contoso Club Members Take An Extra 10%"
                imageFit={ImageFit.cover}
                src={`${process.env.PUBLIC_URL}/assets/SUR20_Book3_Contextual_0287_RGB.jpg`}
              />
              <div className="catagory-details">
                <div className="catagory-name">
                  DEALS &amp; REWARDS
                </div>
                <Stack horizontal horizontalAlign="space-between">
                  <p>Contoso Club Members Take An Extra 10%</p>
                  <IconButton iconProps={{ iconName: 'SingleBookmark' }} ariaLabel="Add Bookmark" />
                </Stack>
              </div>
            </div>
          </Stack.Item>

          <Stack.Item grow>
            <div className="product-panel">
            <Image
                style={{ 
                  backgroundColor: 'lightblue',
                  borderTopLeftRadius: "5pt", borderTopRightRadius: "5pt"}}
                alt="Contoso Club Members Take An Extra 10%"
                imageFit={ImageFit.cover}
                src={`${process.env.PUBLIC_URL}/assets/SUR21_Laptop3_Contextual_0202_RGB.jpg`}
              />
              <div className="catagory-details">
                <div className="catagory-name">
                  DEALS &amp; REWARDS
                    </div>
                <Stack horizontal horizontalAlign="space-between">
                  <p>Contoso Club Members Take An Extra 10%</p>
                  <IconButton iconProps={{ iconName: 'SingleBookmark' }} ariaLabel="Add Bookmark" />
                </Stack>
              </div>
            </div>
          </Stack.Item>
        </Stack>
      </div>
    )
}

export default Deals;