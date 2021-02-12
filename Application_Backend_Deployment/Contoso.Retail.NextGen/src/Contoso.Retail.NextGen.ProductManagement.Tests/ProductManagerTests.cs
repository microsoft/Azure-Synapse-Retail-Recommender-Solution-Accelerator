using Microsoft.VisualStudio.TestTools.UnitTesting;
using Contoso.Retail.NextGen.ProductManagement;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Contoso.Test.MSTestV2;
using System.Threading.Tasks;

namespace Contoso.Retail.NextGen.ProductManagement.Tests
{
    [TestClass()]
    public class ProductManagerTests : TestBase
    {

        private ProductManagementService _productManager;
        static Models.Product newProduct;

        [TestInitialize()]
        public void ProductManagerTest()
        {

            _productManager = new ProductManagementService(Config["Values:DBConnectionString"], "Application");

        }

        [TestMethod()]
        public async Task Test01_RegisterTest()
        {
            newProduct = new Models.Product()
            {
                Name = "foo",
                ProductID = (new Random(-1)).Next(100000,999999).ToString(),
                Brand = "Microsoft",
                Price = 10.02,
                Description = "bla bla bla",
                ImageURL = "http://images.com/foo.jpg"
            };

             var result = await _productManager.Register(newProduct);
            newProduct = result;

            Assert.IsNotNull(newProduct);
        }

        [TestMethod()]
        public async Task Test02_GetProductTest()
        {
            var result = await _productManager.GetProduct(newProduct.ProductID);
            Assert.IsTrue(result.ProductID == newProduct.ProductID);
        }

        [TestMethod()]
        public void Test03_GetAllProductsTest()
        {
            var result = _productManager.GetAllProducts();
            Assert.IsTrue(result.Count() > 0);
        }

        [TestMethod()]
        public async Task Test04_UpdateTest()
        {
            newProduct.Name = "Updated Name";
            await _productManager.Update(newProduct);
            var product = await _productManager.GetProduct(newProduct.ProductID);

            Assert.IsTrue(product.Name == "Updated Name");
        }

        //[TestMethod()]
        //public async Task Test05_RemoveTest()
        //{
        //    var result = await _productManager.Remove(newProduct.Id);

        //    Assert.IsTrue(result);
        //}

    }
}