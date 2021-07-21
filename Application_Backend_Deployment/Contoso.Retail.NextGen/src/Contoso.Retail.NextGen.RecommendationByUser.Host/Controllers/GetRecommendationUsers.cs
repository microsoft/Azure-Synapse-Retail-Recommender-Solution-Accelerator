using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Contoso.Retail.NextGen.ProductManagement.Proxy;

namespace Contoso.Retail.NextGen.RecommendationByUser.Host.Controllers
{
    [Route("ContosoRetail/[controller]")]
    [ApiController]
    public class GetRecommendationUsers : ControllerBase
    {
        ItemRecommender _itemRecommender = null;

        public GetRecommendationUsers(ItemRecommender itemRecommender)
        {
            _itemRecommender = itemRecommender;
        }

        [HttpGet("{UserID}")]
        public async Task<IEnumerable<Product>> GetRecommendation(string UserID)
        {
            return await _itemRecommender.GetRecommendation(UserID);
        }
    }
}
