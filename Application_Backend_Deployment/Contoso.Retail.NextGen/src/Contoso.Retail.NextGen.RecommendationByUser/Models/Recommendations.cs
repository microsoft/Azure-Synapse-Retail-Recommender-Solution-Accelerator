
using Cosmonaut;
using Cosmonaut.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Contoso.Retail.NextGen.RecommendationByUser.Models
{

    [SharedCosmosCollection("user_recommendations","Recommendations")]
    public class Recommendations : ISharedCosmosEntity
    {
        
        [CosmosPartitionKey]
        public string user_id { get; set; }

        public string[] product_ids { get; set; }

        [JsonProperty("id")]
        public string id { get; set; }

        public string CosmosEntityName { get; set; }

        public Recommendations()
        {
            id = Guid.NewGuid().ToString();
        }

    }
}
