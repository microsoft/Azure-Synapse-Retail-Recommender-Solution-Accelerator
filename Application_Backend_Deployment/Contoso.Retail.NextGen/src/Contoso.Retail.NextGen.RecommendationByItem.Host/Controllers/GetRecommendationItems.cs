using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Contoso.Retail.NextGen.ProductManagement.Proxy;
using Microsoft.AspNetCore.Mvc;

namespace Contoso.Retail.NextGen.RecommendationByItem.Host.Controllers
{
    [Route("ContoroRetail/[Controller]")]
    [ApiController]
    public class GetRecommendationItems : ControllerBase
    {
        private IItemRecommender itemRecommeder;

        public GetRecommendationItems(IItemRecommender ItemRecommender)
        {
            itemRecommeder = ItemRecommender;
        }

        [HttpGet("{ProductID}")]
        public async Task<IEnumerable<Product>> GetRecommendation(string ProductID)
        {
            return await itemRecommeder.GetRecommendation(ProductID);
        }

    }
}
