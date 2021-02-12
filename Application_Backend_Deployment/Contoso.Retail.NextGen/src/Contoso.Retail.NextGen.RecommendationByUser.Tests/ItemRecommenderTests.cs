using Contoso.Test.MSTestV2;
using Cosmonaut;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Contoso.Retail.NextGen.RecommendationByUser.Tests
{
    [TestClass()]
    public class ItemRecommenderTests : TestBase
    {
        [TestMethod()]
        public async Task GetRecommendationTest()
        {
            var serviceuri = Config["Values:CosmosCoreAPIUri"];
            var accesskey = Config["Values:CosmosCoreAccessKey"];
            var dbName = Config["Values:CosmosDatabaseName"];
            var productAPIuri = Config["Values:ProductAPIServiceURL"];

            var cosmosSettings = new CosmosStoreSettings(dbName,
                   serviceuri,
                   accesskey);


            ICosmosStore<Models.Recommendations> recommendation = new CosmosStore<Models.Recommendations>(cosmosSettings);

            var recommendationContext = new ItemRecommender(recommendation, productAPIuri);

            var items = await recommendationContext.GetRecommendation("568793129");

            foreach (var item in items)
            {
                Console.WriteLine(JsonConvert.SerializeObject(item));
            }
        }
    }
}