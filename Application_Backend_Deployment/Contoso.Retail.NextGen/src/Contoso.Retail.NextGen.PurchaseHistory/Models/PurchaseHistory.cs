using Cosmonaut;
using Cosmonaut.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contoso.Retail.NextGen.PurchaseHistory.Models
{
    [SharedCosmosCollection("user_purchase_history", "PurchaseHistory")]
    public class PurchaseHistory : ISharedCosmosEntity
    {
        [JsonProperty("id")]
        public string id { get; set; }

        [CosmosPartitionKey]
        public string user_id { get; set; }
        public string[] purchased_items { get; set; }
        public string CosmosEntityName { get; set; }

        public PurchaseHistory()
        {
            id = Guid.NewGuid().ToString();
        }
    }
}
