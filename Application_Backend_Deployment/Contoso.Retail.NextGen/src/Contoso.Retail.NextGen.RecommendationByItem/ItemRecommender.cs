using Contoso.Retail.NextGen.ProductManagement.Proxy;
using Microsoft.VisualBasic.CompilerServices;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Contoso.Retail.NextGen.RecommendationByItem
{
    public class ItemRecommender : IItemRecommender
    {

        private string mlServiceURL = "";
        private string productAPIServiceURL = "";
        private string mlServiceBearerToken = "";

        public ItemRecommender(string MlServiceURL, string ProductAPIServiceURL, string MlServicebearerToken)
        {
            mlServiceURL = MlServiceURL;
            productAPIServiceURL = ProductAPIServiceURL;
            mlServiceBearerToken = MlServicebearerToken;
        }

        public async Task<IEnumerable<Product>> GetRecommendation(string ProductID)
        {
            HttpClient httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri(mlServiceURL);
            httpClient.DefaultRequestHeaders.Authorization
                = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", mlServiceBearerToken);
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.PostAsJsonAsync<ProductInfo>(mlServiceURL, new ProductInfo() { product_id = ProductID });
            response.EnsureSuccessStatusCode();

            var jString = await response.Content.ReadAsStringAsync();

            if (jString.Contains("RDD is empty")) return new Product[] { };
            
            var strippedString = JsonConvert.DeserializeObject(jString).ToString();
            var jsonstring = JObject.Parse(strippedString);
            var products = jsonstring.GetValue("related_products");

            swaggerClient svcClient = new swaggerClient(productAPIServiceURL, new System.Net.Http.HttpClient());
            return await svcClient.GetProductsAsync(products.Select(x => x.ToString()));
        }

    }

    class ProductInfo
    {
        public string product_id { get; set; }
    }

}
