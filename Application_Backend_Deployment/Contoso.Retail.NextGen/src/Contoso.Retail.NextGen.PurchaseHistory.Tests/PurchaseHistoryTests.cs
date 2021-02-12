using Microsoft.VisualStudio.TestTools.UnitTesting;
using Contoso.Retail.NextGen.PurchaseHistory;
using System;
using System.Collections.Generic;
using System.Text;
using Contoso.Test.MSTestV2;
using Cosmonaut;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Contoso.Retail.NextGen.PurchaseHistory.Tests
{
    [TestClass()]
    public class PurchaseHistoryTests : TestBase
    {
        [TestMethod()]
        public async Task GetHistoryTest()
        {
            var serviceuri = Config["Values:CosmosCoreAPIUri"];
            var accesskey = Config["Values:CosmosCoreAccessKey"];
            var dbName = Config["Values:CosmosDatabaseName"];
            var productAPIuri = Config["Values:ProductAPIServiceURL"];


            var cosmosSettings = new CosmosStoreSettings(dbName,
                 serviceuri,
                 accesskey);

            ICosmosStore<Models.PurchaseHistory> history = new CosmosStore<Models.PurchaseHistory>(cosmosSettings);

            var historyContext = new PurchaseHistoryService(history, productAPIuri);

            var items = await historyContext.GetHistory("568804062");

            foreach (var item in items)
            {
                Console.WriteLine(JsonConvert.SerializeObject(item));
            }
        }
    }
}