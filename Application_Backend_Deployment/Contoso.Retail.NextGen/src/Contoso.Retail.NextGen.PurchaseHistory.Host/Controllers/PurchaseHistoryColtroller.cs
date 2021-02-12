using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Contoso.Retail.NextGen.ProductManagement.Proxy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Contoso.Retail.NextGen.PurchaseHistory;

namespace Contoso.Retail.NextGen.PurchaseHistory.Host.Controllers
{
    [Route("ContosoRetail/[controller]")]
    [ApiController]
    public class PurchaseHistoryColtroller : ControllerBase
    {

        private IPurchaseHistoryService purchaseHistoryService = null;

        public PurchaseHistoryColtroller(IPurchaseHistoryService PurchaseHistoryService)
        {
            purchaseHistoryService = PurchaseHistoryService;
        }

        [HttpGet("{UserID}")]
        public async Task<IEnumerable<Product>> GetPurchaseHistory(string UserID)
        {
            return await purchaseHistoryService.GetHistory(UserID);
        }
    }
}
