// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export default interface ISiteTheme {
    sitename?: string;
    sitecolor?: string;
    imageBase64?: string;
    imageName?: string;
    IsColorForTitle: boolean;
    IsColorForAppHeaderBar: boolean;
    disableTextForLogo: boolean;
}