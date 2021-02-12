using Contoso.Retail.NextGen.ProductManagement.Proxy;
using Contoso.Retail.NextGen.PurchaseHistory.Models;
using Cosmonaut;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Contoso.Retail.NextGen.PurchaseHistory
{
    public class PurchaseHistoryService
    {
        ICosmosStore<Models.PurchaseHistory> _cosmosStore = null;
        string productAPIServiceURL = null;
        public PurchaseHistoryService(ICosmosStore<Models.PurchaseHistory> cosmosStore, string ProductAPIServiceURL)
        {
            _cosmosStore = cosmosStore;
            productAPIServiceURL = ProductAPIServiceURL;
        }

        public async Task<IEnumerable<Product>> GetHistory(string UserID)
        {
            var _history = _cosmosStore.Query().Where(x => x.user_id == UserID).SelectMany(p => p.purchased_items).Distinct().ToArray();

            if (_history.Length > 0)
            {
                using (var httpClient = new HttpClient())
                {
                    swaggerClient swaggerClient = new swaggerClient(productAPIServiceURL, httpClient);
                    return await swaggerClient.GetProductsAsync(_history);
                }
            }
            else
            {
                return new Product[] { };
            }
        }
    }
}
