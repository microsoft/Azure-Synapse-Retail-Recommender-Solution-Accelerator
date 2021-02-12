using Contoso.Retail.NextGen.ProductManagement.Proxy;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Contoso.Retail.NextGen.RecommendationByItem
{
    public interface IItemRecommender
    {
        Task<IEnumerable<Product>> GetRecommendation(string ProductID);
    }
}