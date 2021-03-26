// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import './App.css';
import { Text, ITextProps } from 'office-ui-fabric-react/lib/Text';
import { Icon } from '@fluentui/react/lib/Icon';
import { IconButton } from '@fluentui/react/lib/Button';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { STORAGE_ACCOUNT } from "../../config";

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import Home from '../Home/Home';
import NotFound from '../NotFound/NotFound';
import ProductDetail from '../ProductDetail/ProductDetail';
import UserSelect from '../UserSelect/UserSelect';
import Deals from '../Deals/Deals';
import ShoppingCart from '../ShoppingCart/ShoppingCart';
import Recommendations from '../Recommendations/Recommendations';
import OrderHistory from '../OrderHistory/OrderHistory';
import OrderDetail from '../OrderDetail/OrderDetail';
import { ISessionData } from '../../interfaces/ISessionData';
import UpdateCartCount from '../../helpers/UpdateCartCount';
import SiteTheme from '../SiteTheme/SiteTheme';
import UpdateTheme from '../../helpers/UpdateTheme';
import BI from '../BI/BI';

interface IProps {
}

interface IState {
  ispanelopen?: boolean;
  cartcount: number;
  userData?: ISessionData;
}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.initSessionStorage();

    var storeData = JSON.parse(sessionStorage.getItem("ContosoSynapseDemo"));

    this.state = {
      ispanelopen: false,
      cartcount: 0,
      userData: storeData
    };
  }

  componentDidMount() {
    UpdateCartCount();
    UpdateTheme();
  }

  /**
   * Sets up demo user for session storage to manage user's interactions without a dedicated DB.
   * This pre-loads a predefined user's information, be sure user and User ID exist in DB before changing.
   */
  initSessionStorage() {
    const initUUID = "597644399";
    const key = "ContosoSynapseDemo";

    let storeData = {
      "id": initUUID,
      "userName": "Darryl",
      "userImg": `https://${STORAGE_ACCOUNT}.blob.core.windows.net/profile/MSC13_Darryl_01.jpg`,
      "modifiedUser": false,
      "cart": new Array(),
      "orders": new Array()
    }

    // check if data exists onload and pre-load
    if (sessionStorage.getItem("ContosoSynapseDemo") === null) {
      sessionStorage.setItem(key, JSON.stringify(storeData));
    }
    
    
  }

  /** This resets the full app storeage in the web app and resets the demo user. */
  resetSessionStorage() {
    const initUUID = "597644399";
    const key = "ContosoSynapseDemo";

    let storeData = {
      "id": initUUID,
      "userName": "Darryl",
      "userImg": `https://${STORAGE_ACCOUNT}.blob.core.windows.net/profile/MSC13_Darryl_01.jpg`,
      "modifiedUser": false,
      "cart": new Array(),
      "orders": new Array()
    }
    sessionStorage.setItem(key, JSON.stringify(storeData));
    localStorage.removeItem("AzureSynapseStoreTheme");
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Stack horizontal verticalAlign="start">
            <IconButton
              className="menu-button"
              allowDisabledFocus
              color="black"
              iconProps={{ iconName: 'GlobalNavButton' }}
              onClick={() => this.setState({ ispanelopen: !this.state.ispanelopen })}
              title="Menu" ariaLabel="Menu" />
            <Stack.Item grow>
              <Stack horizontal verticalAlign="center">
                <img alt="placeholder" id="LogoHeader" />
                <div className="header-label">Contoso Marketplace</div>
              </Stack>
            </Stack.Item>
            <div id="cart">
              <a href="/ShoppingCart">
                <IconButton
                  allowDisabledFocus
                  color="black"
                  iconProps={{ iconName: 'ShoppingCart' }}
                  title="Shopping Cart" ariaLabel="Shopping Cart" />
              </a>
              <span id="cartitems"></span>
            </div>
            <div id="loginpersona">
              <a href="/UserSelect">
                <Persona
                  title={this.state.userData.userName + " - ID: " + this.state.userData.id}
                  text={this.state.userData.userName}
                  secondaryText={this.state.userData.id}
                  size={PersonaSize.size32}
                  hidePersonaDetails
                  presence={PersonaPresence.none}
                  imageAlt="User Logged In"
                />
              </a>
            </div>
          </Stack>
        </header>
        <Router>
          <main>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/ProductDetail/:id?" component={ProductDetail} />
              <Route path="/UserSelect" component={UserSelect} />
              <Route path="/Deals" component={Deals} />
              <Route path="/ShoppingCart" component={ShoppingCart} />
              <Route path="/OrderHistory" component={OrderHistory} />
              <Route path="/OrderDetail/:id" component={OrderDetail} />
              <Route path="/RecommendedForYou" component={()=> <Recommendations UsesVerticalLayout={true} />} />
              <Route path="/SiteTheme" component={SiteTheme} />
              <Route path="/BI" component={BI} />
              <Route path='*' component={NotFound} />
            </Switch>
          </main>
        </Router>

        
        <Panel
          hasCloseButton={true}
          allowTouchBodyScroll={true}
          headerText="Menu"
          isOpen={this.state.ispanelopen}
          isLightDismiss={true}
          onDismiss={() => this.setState({ ispanelopen: !this.state.ispanelopen })}
          closeButtonAriaLabel="Close"
          type={PanelType.smallFixedNear}>
          <Stack id="menupanel" tokens={{ childrenGap: 30 }}>
            <a href="/">
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                <Icon iconName="Home" ariaLabel="Home Icon" style={{ fontSize: "20px" }} />
                <Text nowrap block variant={'large'}>Home</Text>
              </Stack>
            </a>
            <a href="/Deals">
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                <Icon iconName="ShopServer" ariaLabel="Deals Icon" style={{ fontSize: "20px" }} />
                <Text nowrap block variant={'large'}>My Deals</Text>
              </Stack>
            </a>
            <a href="/RecommendedForYou">
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                <Icon iconName="ContactHeart" ariaLabel="Heart Icon" style={{ fontSize: "20px" }} />
                <Text nowrap block variant={'large'}>Recommended For You</Text>
              </Stack>
            </a>
            <a href="/OrderHistory">
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                <Icon iconName="Package" ariaLabel="Package Icon" style={{ fontSize: "20px" }} />
                <Text nowrap block variant={'large'}>Order History</Text>
              </Stack>
            </a>
          </Stack>
          <Stack id="demopanel" tokens={{ childrenGap: 30 }}>
            <a href="/" onClick={() => this.resetSessionStorage()}>
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                <Icon iconName="RevToggleKey" aria-label="Reset Demo Icon" style={{ fontSize: "20px" }} />
                <Text nowrap block variant={'large'}>Reset Demo</Text>
              </Stack>
            </a>
            <a href="/BI">
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                <Icon iconName="PowerBILogo" aria-label="Power BI Icon" style={{ fontSize: "20px" }} />
                <Text nowrap block variant={'large'}>Marketplace BI</Text>
              </Stack>
            </a>
            <a href="/SiteTheme">
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                <Icon iconName="Color" aria-label="Theme Icon" style={{ fontSize: "20px" }} />
                <Text nowrap block variant={'large'}>Configure Theme</Text>
              </Stack>
            </a>
          </Stack>
        </Panel>
        <footer>
          <div className="footer-image">
              <img alt="Contoso"
                id="FooterLogo"
                src={process.env.PUBLIC_URL + '/assets/contoso.png'}
              />
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
