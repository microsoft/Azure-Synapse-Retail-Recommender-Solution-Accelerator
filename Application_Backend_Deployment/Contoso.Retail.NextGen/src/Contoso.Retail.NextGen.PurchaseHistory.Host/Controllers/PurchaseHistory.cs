using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Contoso.Retail.NextGen.ProductManagement.Proxy;
using Cosmonaut;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Contoso.Retail.NextGen.PurchaseHistory;

namespace Contoso.Retail.NextGen.PurchaseHistory.Host.Controllers
{
    [Route("ContosoRetail/[controller]")]
    [ApiController]
    public class PurchaseHistory : ControllerBase
    {
        ICosmosStore<Models.PurchaseHistory> _cosmosStore = null;
        string productAPIServiceURL = null;
        public PurchaseHistory(ICosmosStore<Models.PurchaseHistory> cosmosStore, IConfiguration config)
        {
            _cosmosStore = cosmosStore;
            productAPIServiceURL = config["Values:ProductAPIServiceURL"];
        }

        [HttpGet("{UserID}")]
        public async Task<IEnumerable<Product>> GetPurchaseHistory(string UserID)
        {
            var _purchaseHistory = new PurchaseHistoryService(_cosmosStore, productAPIServiceURL);
            return await _purchaseHistory.GetHistory(UserID);
        }

    }
}
