using Contoso.DataAccess.CosmosDB.Sql.ModelBase;
using Contoso.DataAccess.CosmosDB.Sql;
using Contoso.Retail.NextGen.ProductManagement.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Contoso.Retail.NextGen.ProductManagement
{
    public class ProductManagementService : CosmosSqlEntityCollectionBase<Models.Product, Guid>, IProductManager
    {
        public ProductManagementService(string DataConnectionString, string CollectionName) : base(DataConnectionString, CollectionName)
        {
        }

        protected override void ModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Models.Product>(e => {
                e.HasPartitionKey(e => e.ProductID);
            });
            base.ModelCreating(modelBuilder);
        }

        public async Task<Models.Product> Register(Models.Product Product)
        {
            var affectedRow = await ObjectCollection.AddAsync(Product);

            return (affectedRow >= 1) ? Product : null;

        }

        public async Task<Models.Product> GetProduct(string ProductId)
        {
            return await ObjectCollection.FindAsync(new GenericSpecification<Models.Product>(x => x.ProductID == ProductId));
        }

        public async Task<IEnumerable<Models.Product>> GetProductsByCategory(string CategoryName)
        {
            return await ObjectCollection.FindAllAsync(new GenericSpecification<Models.Product>(x => x.ProductCategory == CategoryName));
        }

        public async IAsyncEnumerable<Models.Product> GetProducts(string[] ProductIDs)
        {
            foreach (var item in ProductIDs)
            {
                yield return await GetProduct(item);
            }
        }

        public IEnumerable<Models.Product> GetAllProducts()
        {
            return ObjectCollection.GetAll();
        }

        public async Task<bool> Update(Models.Product Product)
        {
            await ObjectCollection.SaveAsync(Product);
            return true;
        }

        public async Task<bool> Remove(Models.Product Product)
        {
            int affectedRow = await ObjectCollection.DeleteAsync(Product);
            return (affectedRow > 0);
        }

        public async Task<bool> Remove(Guid ProductID)
        {
            int affectedRow = await ObjectCollection.DeleteAsync(ProductID);
            return (affectedRow > 0) ;
        }
    }
}
