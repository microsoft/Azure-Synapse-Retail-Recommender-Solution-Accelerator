using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Contoso.Retail.NextGen.ProductManagement.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Contoso.Retail.NextGen.ProductManagement.Host.Controllers
{
    [Route("ContosoRetail/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private IProductManager productManager;
        public ProductsController(IProductManager ProductManager)
        {
            productManager = ProductManager;
        }

        [HttpGet]
        public IEnumerable<Product> Get()
        {
            return productManager.GetAllProducts();
        }

        [HttpGet("{ProductId}")]
        public async Task<Product> Get(string ProductId)
        {
            return await productManager.GetProduct(ProductId);
        }

        [HttpGet]
        [Route("GetProductsByCategory")]
        public async Task<IEnumerable<Product>> GetProductsByCategory([FromQuery] string CategoryName)
        {
            return await productManager.GetProductsByCategory(CategoryName);
        }

        [HttpPost]
        [Route("GetProducts")]
        public IAsyncEnumerable<Product> GetProducts(string[] ProductIDS)
        {
            return productManager.GetProducts(ProductIDS);
        }


        [HttpPost]
        public async Task<Models.Product> Post([FromBody] Models.Product Product)
        {
            return await productManager.Register(Product);
        }

        [HttpPut]
        public async Task<bool> Put([FromBody] Models.Product Product)
        {
            return await productManager.Update(Product);
        }

        [HttpDelete("{ProductId}")]
        public async Task<bool> Delete(Guid ProductId)
        {
            return await productManager.Remove(ProductId);
        }
    }
}
