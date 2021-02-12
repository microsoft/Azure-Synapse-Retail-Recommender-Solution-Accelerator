// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import { PrimaryButton, Stack, Label, Text, DefaultButton, Link, TextField, ColorPicker, IColor, Icon, isMac, Toggle, LinkBase, Tooltip, TooltipHost } from '@fluentui/react';
import '../SiteTheme/SiteTheme.scss';
import ISiteTheme from '../../interfaces/ISiteTheme';
import { EventSender } from '../EventSender/EventSender';

const viewStyles = {
    padding: "20px 20px",
    maxWidth: "300px"
}

class SiteTheme extends React.Component<{}, ISiteTheme> {
    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            imageName: null,
            IsColorForAppHeaderBar: false,
            IsColorForTitle: true,
            sitecolor: "#000000",
            disableTextForLogo: false
        }
        this.submitTheme = this.submitTheme.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.saveImage = this.saveImage.bind(this);
        this.changeTitleColor = this.changeTitleColor.bind(this);
        this.changeAppBarColor = this.changeAppBarColor.bind(this);
        this.resetForm = this.resetForm.bind(this);

        this.sendToEventHub = this.sendToEventHub.bind(this);
        this.sendToEventHub();
    }

    private async sendToEventHub() {
        let key = "ContosoSynapseDemo";
        let storeData = JSON.parse(sessionStorage.getItem(key));
        var eventClient = new EventSender();
        
        await eventClient.SendEvent({ 
            "userID": storeData.id, 
            "httpReferer": window.location.href,
            "product_id": null,
            "brand": null,
            "price": null,
            "category_id": null,
            "category_code": null,
            "user_session": null
        });
    }

    private submitTheme(event: React.FormEvent<HTMLFormElement>) {
        event.stopPropagation();
        event.preventDefault();

        localStorage.setItem("AzureSynapseStoreTheme", JSON.stringify(this.state));
        window.location.href= "/";

    };
    private changeTitleColor(event: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean) {
        this.setState({ IsColorForTitle: true, IsColorForAppHeaderBar: false });
    };
    private changeAppBarColor(event: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean) {
        this.setState({ IsColorForTitle: false, IsColorForAppHeaderBar: true });
    };
    private resetForm(event: React.MouseEvent<HTMLElement | HTMLAnchorElement | HTMLButtonElement | LinkBase, MouseEvent>) {
        localStorage.removeItem("AzureSynapseStoreTheme");
        window.location.href = "/SiteTheme";
    };
    
    private async saveImage(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files[0];
        const that = this;
        const reader = new FileReader(); 
        this.setState({ imageName: file.name });
        reader.onloadend = await function(event) {
            const results = event.target.result;
            that.setState({ imageBase64: results.toString(), disableTextForLogo: true, IsColorForAppHeaderBar: true, IsColorForTitle: false });
        };
        try {
            reader.readAsDataURL(file);
        } catch (error) {
            console.warn(error);
        }
        
    };
    private setTitle(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) {
        this.setState({ sitename: newValue });
    };
    private changeColor(ev: React.SyntheticEvent<HTMLElement, Event>, color: IColor) {
        this.setState({ sitecolor: "#" + color.hex });
    };

    render() {
        return(
            <form style={viewStyles} onSubmit={this.submitTheme}>
                <Stack horizontal horizontalAlign="space-between" verticalAlign="baseline">
                    <Text variant="xLarge">Configure Theme</Text>
                    <Link 
                    onClick={this.resetForm}
                    styles={{ root: { fontSize: "12px" }}}>Reset To Default</Link>
                </Stack>
                <Stack tokens={{ childrenGap: 20 }} styles={{ root: { marginTop: 20 }}}>
                    <TextField required 
                    autoComplete="false"
                    value={this.state.sitename}
                    onChange={this.setTitle}
                    label="App Title" placeholder="Contoso Marketplace" />
                    <div>
                        <Label>App Logo (Optional) <TooltipHost closeDelay={500} content="Use a 50px x 80px transparent logo"><Icon iconName="Info" /></TooltipHost></Label>
                        <PrimaryButton htmlFor="logoUpload" 
                        iconProps={{ iconName: "Upload" }}>
                            <input type="file" 
                                    onChange={this.saveImage}
                                    className="upload" 
                                    name="logoUpload" 
                                    accept='image/*' /> Choose Image File</PrimaryButton>
                         
                    </div>
                    <div>
                    {
                            this.state.imageName !== null &&
                            <Label><Icon iconName="FileImage" /> {this.state.imageName}</Label>
                        }
                    </div>
                   <div>
                   <Label>Accent Color</Label>
                    <ColorPicker
                        color={this.state.sitecolor}
                        alphaType="none"
                        showPreview={true}
                        onChange={this.changeColor}
                        // The ColorPicker provides default English strings for visible text.
                        // If your app is localized, you MUST provide the `strings` prop with localized strings.
                        strings={{
                        // By default, the sliders will use the text field labels as their aria labels.
                        // If you'd like to provide more detailed instructions, you can use these props.
                        alphaAriaLabel: 'Alpha slider: Use left and right arrow keys to change value, hold shift for a larger jump',
                        transparencyAriaLabel:
                            'Transparency slider: Use left and right arrow keys to change value, hold shift for a larger jump',
                        hueAriaLabel: 'Hue slider: Use left and right arrow keys to change value, hold shift for a larger jump',
                        }}
                    />
                   </div>
                   <Stack>
                    <Toggle inlineLabel 
                    checked={this.state.IsColorForTitle}
                    onChange={this.changeTitleColor}
                    disabled={this.state.disableTextForLogo}
                    label="Apply color to app title (text color)"  />
                    <Toggle inlineLabel 
                    onChange={this.changeAppBarColor}
                    disabled={this.state.disableTextForLogo}
                    checked={this.state.IsColorForAppHeaderBar}
                    label="Apply color to app header" />
                   </Stack>
                    <Stack horizontal horizontalAlign="space-between">
                        <DefaultButton type="button" onClick={() => window.location.href = "/"}>Cancel</DefaultButton>
                        <PrimaryButton type="submit">Save &amp; Apply</PrimaryButton>
                    </Stack>
                </Stack>
            </form>
        );
    }
}

export default SiteTheme;