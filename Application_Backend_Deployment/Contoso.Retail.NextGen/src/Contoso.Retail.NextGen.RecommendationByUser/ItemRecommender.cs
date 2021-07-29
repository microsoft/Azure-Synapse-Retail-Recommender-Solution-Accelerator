using Contoso.Retail.NextGen.RecommendationByUser.Models;
using Contoso.Retail.NextGen.ProductManagement.Proxy;
using System.Collections.Generic;

using System.Threading.Tasks;
using System;
using Microsoft.Solutions.CosmosDB.SQL;
using Microsoft.Solutions.CosmosDB;
using System.Net.Http;

namespace Contoso.Retail.NextGen.RecommendationByUser
{
    public class ItemRecommender : SQLEntityCollectionBase<user_recommendation, string>
    {
        
        string productAPIServiceURL = null;

        public ItemRecommender(string DataConnectionString, string CollectionName, string ProductAPIServiceURL) : base(DataConnectionString, CollectionName, "user_recommendations")
        {
            productAPIServiceURL = ProductAPIServiceURL;
        }

        public async Task<IEnumerable<Product>> GetRecommendation(string UserID)
        {
            var _recommendations = await this.ObjectCollection.FindAsync(new GenericSpecification<user_recommendation>(x => x.user_id == int.Parse(UserID)));
            
            if (_recommendations != null && _recommendations.product_ids.Length > 0)
            {
                using (var httpClient = new HttpClient())
                {
                    swaggerClient swaggerClient = new swaggerClient(productAPIServiceURL, httpClient);
                    return await swaggerClient.GetProductsAsync(_recommendations.product_ids);
                }

            }
            else
            {
                return new Product[] { };
            }
        }

    }
        
}
