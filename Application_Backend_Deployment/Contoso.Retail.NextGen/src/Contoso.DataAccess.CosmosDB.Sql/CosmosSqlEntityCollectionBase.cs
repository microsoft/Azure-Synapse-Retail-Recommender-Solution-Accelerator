using System;
using System.Collections.Generic;
using System.Text;
using Contoso.DataAccess.CosmosDB.Sql.ModelBase;
using Contoso.DataAccess.CosmosDB.Sql;
using Microsoft.EntityFrameworkCore;

namespace Contoso.DataAccess.CosmosDB.Sql
{
    public class CosmosSqlEntityCollectionBase<TEntity, Guid> where TEntity : class, IEntityModel<Guid>, IDisposable
    {
        protected IRepository<TEntity, Guid> ObjectCollection;

        public CosmosSqlEntityCollectionBase(string DataConnectionString, string CollectionName, bool EnsureCreate = true ,bool AutoGenerationCollectionName = true)
        {
            var dbContext = new BusinessTransactionRepository<TEntity, Guid>(DataConnectionString,
                CollectionName, AutoGenerationCollectionName);
            
            dbContext.OnEFModelCreating += DbContext_OnEFModelCreating;

            if (EnsureCreate) dbContext.Database.EnsureCreatedAsync().GetAwaiter().GetResult();
            
            this.ObjectCollection = dbContext;
        }

        private void DbContext_OnEFModelCreating(ModelBuilder modelBuilder)
        {
            ModelCreating(modelBuilder);
        }

        protected virtual void ModelCreating(ModelBuilder modelBuilder)
        {
        }

        protected void Dispose()
        {
            ((DbContext)this.ObjectCollection).Dispose();
        }


    }
}
