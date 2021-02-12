using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cosmonaut;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Contoso.Retail.NextGen.RecommendationByUser;
using Contoso.Retail.NextGen.ProductManagement.Proxy;
using Microsoft.Extensions.Configuration;

namespace Contoso.Retail.NextGen.RecommendationByUser.Host.Controllers
{
    [Route("ContosoRetail/[controller]")]
    [ApiController]
    public class GetRecommendationUsers : ControllerBase
    {
        ICosmosStore<Models.Recommendations> _cosmosStore = null;
        string productAPIServiceURL = null;
        public GetRecommendationUsers(ICosmosStore<Models.Recommendations> cosmosStore, IConfiguration config)
        {
            _cosmosStore = cosmosStore;
            productAPIServiceURL = config["Values:ProductAPIServiceURL"];
        }

        [HttpGet("{UserID}")]
        public async Task<IEnumerable<Product>> GetRecommendation(string UserID)
        {
            var _userRecommender = new RecommendationByUser.ItemRecommender(_cosmosStore, productAPIServiceURL);
            return await _userRecommender.GetRecommendation(UserID);
        }
    }
}
