// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Set your subscription key here:
const SUBSCRIPTION_KEY = "[ENTER KEY]";

/**
 * Options available for possiblie categories.  Update this enum for additional Options if your APIs have additonal categories.
 */
export enum CategoriesOptions {
    Electronics = "Electronics",
    Home = "Home",
    Outdoor_Living = "Outdoor Living",
    Tools_Hardware = "Tools_Hardware"
}

/**
 * API URI for User Profiles
 */
export const GET_USER_PROFILES = "[ENTER USERS PROFILE API]" +"?subscription-key=" + SUBSCRIPTION_KEY;

/**
 * API URI for item recommendations.
 * @param {string} product_id - ID of product for the API to reference. (required)
 */
export function getItemRecommendations(product_id: number) {
   return "[ENTER ITEM RECOMMENDER API ]" + product_id + "?subscription-key=" + SUBSCRIPTION_KEY;
}

/**
 * API URI for user's recommendations.
 * @param {string} user_id - Active User's ID already in system (required)
 */
export function getUserRecommendations(user_id: string) {
    return "[ENTER GET USER RECOMMENDATION API]" + user_id + "?subscription-key=" + SUBSCRIPTION_KEY;
}
/**
 * API URI for full product details.
 * @param {string} product_id - ID of product for the API to reference. (required)
 */
export function getProductDetails(product_id: string) {
    return "[ENTER GET PRODUCT DETAILS API]" + product_id + "?subscription-key=" + SUBSCRIPTION_KEY;
}

/**
 * API URI for full product details.
 * @param {CategoriesOptions} category_name - Category Name being referenced. (required, use enum CategoriesOptions)
 */
export const GET_PRODUCTS_BY_CATEGORY = "[ENTER GET PRODUCT BY CATEGORY ID API]" + "?subscription-key=" + SUBSCRIPTION_KEY + "&categoryname=";


/** Config Event hub name for EventSender.tsx */
export const EVENT_HUB_NAMESPACE = "[ENTER NAMESPACE]";

/** Config Key name for EventSender.tsx */
export const EVENT_HUB_KEYNAME = "[ENTER KEY NAME]";

/** Config Access key for EventSender.tsx */
export const EVENT_HUB_ACCESS_KEY = "[ENTER ACCESS KEY]";

/**Config Storage Account from Appliacation_Backend_Deployment */
export const STORAGE_ACCOUNT = "[ENTER STORAGE ACCOUNT NAME]"
