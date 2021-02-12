using Contoso.Retail.NextGen.ProductManagement.Proxy;
using Contoso.Retail.NextGen.RecommendationByItem;
using Contoso.Test.MSTestV2;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contoso.Retail.NextGen.RecommendationByItem.Tests
{
    [TestClass()]
    public class ItemRecommenderTests : TestBase
    {

        static ItemRecommender _itemRecommender;

        [TestInitialize()]
        public void ItemRecommenderTestsInit()
        {
            if (_itemRecommender == null)
            {
                _itemRecommender = new ItemRecommender(Config["Values:MLserviceUrl"],
                    Config["Values:ProductAPIServiceURL"],
                    Config["Values:MLServiceBearerToken"]);
            }
        }


        [TestMethod()]
        public async Task GetRecommendationTest()
        {
            var result = await _itemRecommender.GetRecommendation("100013980");

            foreach (var item in result)
            {
                Console.WriteLine(JsonConvert.SerializeObject(item));
            }
        }
    }
}
