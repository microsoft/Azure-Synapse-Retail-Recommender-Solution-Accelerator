using Contoso.Test.MSTestV2;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace Contoso.Retail.NextGen.RecommendationByUser.Tests
{
    [TestClass()]
    public class ItemRecommenderTests : TestBase
    {
        [TestMethod()]
        public async Task GetRecommendationTest()
        {
            var dbConnectionString = Config["Values:DBConnectionString"];
            var productAPIuri = Config["Values:ProductAPIServiceURL"];

            var recommendationContext = new ItemRecommender(dbConnectionString, "product_data", productAPIuri);

            var items = await recommendationContext.GetRecommendation("568793129");

            foreach (var item in items)
            {
                Console.WriteLine(JsonConvert.SerializeObject(item));
            }
        }
    }
}