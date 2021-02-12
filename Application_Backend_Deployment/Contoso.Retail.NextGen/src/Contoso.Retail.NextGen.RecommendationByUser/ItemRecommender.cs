using Contoso.Retail.NextGen.RecommendationByUser.Models;
using Contoso.Retail.NextGen.ProductManagement.Proxy;
using Cosmonaut;
using Cosmonaut.Extensions;
using Cosmonaut.Testing;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Contoso.Retail.NextGen.RecommendationByUser
{
    public class ItemRecommender
    {
        ICosmosStore<Models.Recommendations> _cosmosStore = null;
        string productAPIServiceURL = null;
        public ItemRecommender(ICosmosStore<Models.Recommendations> cosmosStore, string ProductAPIServiceURL)
        {
            _cosmosStore = cosmosStore;
            productAPIServiceURL = ProductAPIServiceURL;
        }

        public async Task<IEnumerable<Product>> GetRecommendation(string UserID)
        {
            var _recommendations = _cosmosStore.Query().Where(x => x.user_id == UserID).ToArray();
            
            if (_recommendations.Length > 0)
            {
                using (var httpClient = new HttpClient())
                {
                    swaggerClient swaggerClient = new swaggerClient(productAPIServiceURL, httpClient);
                    return await swaggerClient.GetProductsAsync(_recommendations[0].recommendations);
                }

            } else
            {
                return new Product[] { }; 
            }
        }

    }
        
}
