
using Microsoft.Solutions.CosmosDB;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Contoso.Retail.NextGen.RecommendationByUser.Models
{
    public class user_recommendation : CosmosDBEntityBase
    {
        public int user_id { get; set; }
        public string[] product_ids { get; set; }
    }
}
