// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import ISiteTheme from "../interfaces/ISiteTheme";

function UpdateTheme() {
    const themeData: ISiteTheme = JSON.parse(globalThis.localStorage.getItem("AzureSynapseStoreTheme"));
    const headerText = document.getElementsByClassName("header-label")[0] as HTMLDivElement;
    const headerBar = document.getElementsByClassName("App-header")[0] as HTMLHeadingElement;
    const headerLogo = document.getElementById("LogoHeader") as HTMLImageElement;
    const footerLogo = document.getElementById("FooterLogo") as HTMLImageElement;

    if (globalThis.localStorage.getItem("AzureSynapseStoreTheme") !== null) {
        

        headerText.innerText = themeData.sitename;

        if (themeData.IsColorForAppHeaderBar) {
            headerBar.style.backgroundColor = themeData.sitecolor;
            headerText.style.color = "#FFFFFF";

            let brandingCSS = `
                /* GENERATED STYLES */
                #FooterLogo {
                    width: 80px;
                    height: 50px;
                }
                .linkIsSelected-77::before { background-color: ` + themeData.sitecolor + ` }
                button.ms-Button.ms-Button--icon.root-41:hover,
                button.ms-Button.ms-Button--icon.menu-button.root-41:hover,
                button.ms-Button.ms-Button--icon.menu-button.root-41:active {
                    color: ` + themeData.sitecolor + ` !important;
                    background-color: ` + themeData.sitecolor + ` !important;
                }
                .root-72, .root-89 {
                    border-color: ` + themeData.sitecolor + `;
                    background-color: ` + themeData.sitecolor + ` !important;
                }
                .ms-ColorPicker.root-89 {
                    border-color: transparent;
                    background-color: #ffffff !important;
                }
                .add-to-cart-btn {
                    background: ` + themeData.sitecolor + ` 0% 0% no-repeat;
                }
                span.ms-Button-flexContainer.flexContainer-42 {
                    color: white;
                }
                .ms-Button--default > span.ms-Button-flexContainer.flexContainer-42 {
                    color: rgb(50, 49, 48) !important;
                    border-color: rgb(138, 136, 134) !important;
                }
                .ms-Button.ms-Button--primary {
                    border-color: ` + themeData.sitecolor + `;
                    background-color: ` + themeData.sitecolor + ` !important;
                }
                .ms-Link.root-71 {
                    color: ` + themeData.sitecolor + ` !important;
                }
                .title-area > a,
                .title-area > a:hover,
                .catagory-name,
                .footer-links a,
                #ProductDetail .navigationBack a,
                a:hover, a:active {
                    color: ` + themeData.sitecolor + ` !important;
                }
            `
            let styleNode = document.createElement("style");
            styleNode.innerHTML = brandingCSS;
            document.body.append(styleNode);

        } else {
            for (const key in document.getElementsByClassName("root-41")) {
                if (document.getElementsByClassName("root-41").hasOwnProperty(key)) {
                    const element = document.getElementsByClassName("root-41")[key] as HTMLElement;
                    element.style.color = themeData.sitecolor;
                    
                }
            }
            for (const key in document.querySelectorAll("a")) {
                if (document.querySelectorAll("a").hasOwnProperty(key)) {
                    const element = document.querySelectorAll("a")[key] as HTMLElement;
                    element.style.color = themeData.sitecolor;
                    
                }
            }
            for (const key in document.querySelectorAll(".catagory-name")) {
                if (document.querySelectorAll(".catagory-name").hasOwnProperty(key)) {
                    const element = document.querySelectorAll(".catagory-name")[key] as HTMLElement;
                    element.style.color = themeData.sitecolor;
                    
                }
            }

            headerText.style.color = themeData.sitecolor;
            let tabCSS = ".linkIsSelected-77::before { background-color: " + themeData.sitecolor + " } .ms-button, .root-72, #cartitems { background-color: " + themeData.sitecolor + " !important } a:hover { color: " + themeData.sitecolor + " !important } .add-to-cart-btn, .add-to-cart-btn:hover, .add-to-cart-btn:active { background: " + themeData.sitecolor + " !important }"
            let styleNode = document.createElement("style");
            styleNode.innerHTML = tabCSS;
            document.body.append(styleNode);
        }
        if (themeData.imageName !== null) {
            headerLogo.src = themeData.imageBase64;
            headerLogo.alt = themeData.sitename;
            headerLogo.setAttribute("aria-label", themeData.sitename);
            footerLogo.src = themeData.imageBase64;
            footerLogo.alt = themeData.sitename;
            footerLogo.setAttribute("aria-label", themeData.sitename);
        } else {
            headerLogo.alt = "";
            headerLogo.style.display = "none";
        }
    } else {
        headerLogo.alt = "";
        headerLogo.style.display = "none";
    }
}
export default UpdateTheme;