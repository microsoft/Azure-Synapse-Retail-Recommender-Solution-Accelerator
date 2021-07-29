// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as EventHubLib from "@azure/event-hubs";
import { EVENT_HUB_ACCESS_KEY, EVENT_HUB_KEYNAME, EVENT_HUB_NAMESPACE } from "../../config";
import { IEventMessage } from '../../interfaces/IEventMessage';

/** Method for sending events to Event Hub in Azure. */
export class EventSender {
    public async SendEvent(eventMessage: IEventMessage) {
        var eventProducer = new EventHubProcuder();
        await eventProducer.SendMessage(JSON.stringify(eventMessage));
    }
}

/** Manages Event Hub settings and sends data with the correct configuration. */
class EventHubProcuder {
    private connectionString: string;
    private eventHubName: string;
    private eventHubclient: EventHubLib.EventHubProducerClient;

    constructor() {
        this.connectionString = `Endpoint=sb://${EVENT_HUB_NAMESPACE}.servicebus.windows.net/;SharedAccessKeyName=${EVENT_HUB_KEYNAME};SharedAccessKey=${EVENT_HUB_ACCESS_KEY};`
        this.eventHubName = "clickthrough";
        this.eventHubclient = new EventHubLib.EventHubProducerClient(this.connectionString, this.eventHubName);
    }

    public async SendMessage(JsonString: string) {
        var batchOptions: EventHubLib.CreateBatchOptions = {};
        let batch = await this.eventHubclient.createBatch(batchOptions);

        var result = batch.tryAdd({ body: JsonString });

        if (!result) {
            console.log("Can't send this message at thie time : \nMessage :" + JsonString);
            return;
        }

        if (batch.count === 0) {
            console.log("Message was too large so can't send it until it being made smaller. skipping it");
            return;
        }

        await this.eventHubclient.sendBatch(batch);
    }
}