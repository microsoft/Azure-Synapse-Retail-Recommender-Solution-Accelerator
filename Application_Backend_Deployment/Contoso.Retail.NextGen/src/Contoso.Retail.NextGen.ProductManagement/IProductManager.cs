using Contoso.Retail.NextGen.ProductManagement.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Contoso.Retail.NextGen.ProductManagement
{
    public interface IProductManager
    {
        IEnumerable<Product> GetAllProducts();
        Task<IEnumerable<Product>> GetProductsByCategory(string CategoryName);
        IAsyncEnumerable<Product> GetProducts(string[] ProductIDs);
        Task<Product> GetProduct(string ProductId);
        Task<Product> Register(Product Product);
        Task<bool> Remove(Guid ProductID);
        Task<bool> Remove(Product Product);
        Task<bool> Update(Product Product);
    }
}