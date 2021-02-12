// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import { Text } from 'office-ui-fabric-react/lib/Text';
import '../NotFound/NotFound.css';

/**
 * View for 404 pages via React Router.
 */
const NotFound: React.StatelessComponent = () => {
    return (
        <div id="NotFound">
            <h1><Text variant="xxLargePlus">Page not found</Text></h1>
        </div>
    )
}

export default NotFound;