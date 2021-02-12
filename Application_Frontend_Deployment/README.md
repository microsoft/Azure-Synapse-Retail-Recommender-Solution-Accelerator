# Application Fronend Deployment
## Azure Synapse Analyitcs Accelrator UI Demo

This is a [TypeScript](https://www.typescriptlang.org/) powered [React.js](https://reactjs.org/) UI demo showing a sample storefront connectivity for [Azure Synapse](https://azure.microsoft.com/en-us/services/synapse-analytics/?&OCID=AID2000128_SEM_XIpzFAAAAM3KNQ4G:20200518175959:s&msclkid=e4026b80c353173d750135420e4ef9fa&ef_id=XIpzFAAAAM3KNQ4G:20200518175959:s&dclid=CjgKEAjw5Ij2BRD11dqFj7vJhQUSJAAVzmCK-MqUncwnvC3LiyXOd_jZyfx-xAa0dF57t3E-SBCtxvD_BwE) to a portable React UI focused on mobile users.  The demo also uses: [Fluent UI using React](https://developer.microsoft.com/en-us/fluentui#/get-started/web), [SCSS](https://sass-lang.com/) for custom UI styling, and [HTML5 Session State](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) for managing users.

## STEP 1
- * In the file  `/contoso-retail/src/config.ts`, edit the following: 

            /** USER PROFILE API from API Management URL */ 
            export const GET_USER_PROFILES = "[ENTER USERS PROFILE API]" +"?subscription-key=" + SUBSCRIPTION_KEY;

            /** ITEM RECOMMENDATION from API Management URL */
            export function getItemRecommendations(product_id: number) {
                    return "[ENTER ITEM RECOMMENDER API ]" + product_id + "?subscription-key=" + SUBSCRIPTION_KEY;
            }

            /** GET USER RECOMMENDATION API from API Management */ 
            export function getUserRecommendations(user_id: string) {
                return "[ENTER GET USER RECOMMENDATION API]" + user_id + "?subscription-key=" + SUBSCRIPTION_KEY;
            }

            /** GET PRODUCT DETAILS API from API Management */
            export function getProductDetails(product_id: string) {
                return "[ENTER GET PRODUCT DETAILS API]" + product_id + "?subscription-key=" + SUBSCRIPTION_KEY;
            }

            /** GET PRODUCT BY CATEGORY API from API Management */ 
            export const GET_PRODUCTS_BY_CATEGORY = "[ENTER GET PRODUCT BY CATEGORY ID API]" + "?subscription-key=" + SUBSCRIPTION_KEY + "&categoryname=";

            /** EVENT HUB NAMESPACE from Event Hub */
            export const EVENT_HUB_NAMESPACE = "[ENTER NAMESPACE]";

            /** EVENT HUB KEY NAME from Event Hubs */ 
            export const EVENT_HUB_KEYNAME = "[ENTER KEY NAME]";

            /** EVENT HUB ACCESS KEY from Event Hub */ 
            export const EVENT_HUB_ACCESS_KEY = "[ENTER ACCESS KEY]";
            
            /** PRODUCT IMAGE STORAGE ACCOUNT NAME from Application_Backend_Deploymnet */ 
            export const STORAGE_ACCOUNT = "[ENTER STORAGE ACCOUNT NAME]"

            /** POWER BI URL */
            export const POWER_BI_URL = "[ENTER POWER BI NAME]"


## Demo Site:
[View Demo](https://synapsefornextgenretail.azurewebsites.net/)

## Available Scripts

In the project directory `contoso-retail`, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
