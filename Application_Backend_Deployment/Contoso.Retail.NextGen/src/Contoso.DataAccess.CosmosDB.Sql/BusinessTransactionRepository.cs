using Contoso.DataAccess.CosmosDB.Sql.ModelBase;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Cosmos.Diagnostics;
using Microsoft.EntityFrameworkCore.Cosmos.Storage.Internal;
using Microsoft.EntityFrameworkCore.ValueGeneration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Console;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Permissions;
using System.Threading.Tasks;

namespace Contoso.DataAccess.CosmosDB.Sql
{

    public delegate void EFOnModelCreating(ModelBuilder modelBuilder);

    public class BusinessTransactionRepository<TEntity, TIdentifier> : DbContext, IRepository<TEntity, TIdentifier> where TEntity : class, IEntityModel<TIdentifier>
    {
        public event EFOnModelCreating OnEFModelCreating;

        public DbSet<TEntity> CurrentEntity { get; set; }
        private string connectionString = "";
        private string databaseName = "";
        private bool autogenerateCollectionName = true;
        public BusinessTransactionRepository(string ConnectionString, string DatabaseName, bool AutoGenerationCollectionName = true)
        {
            connectionString = ConnectionString;
            databaseName = DatabaseName;
            autogenerateCollectionName = AutoGenerationCollectionName;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .UseCosmos(connectionString, databaseName);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            if (autogenerateCollectionName) modelBuilder.Entity<TEntity>().ToContainer(typeof(TEntity).Name + "s");
          
   


            OnEFModelCreating(modelBuilder);
            base.OnModelCreating(modelBuilder);
        }

        public async Task<TEntity> Get(TIdentifier id)
        {
            return await CurrentEntity.FirstOrDefaultAsync<TEntity>(x => x.Id.Equals(id));
        }

        public async Task<int> AddAsync(TEntity entity)
        {
            this.CurrentEntity.Add(entity);
            return await this.SaveChangesAsync(true);
        }

        public async Task<TEntity> FindAsync(ISpecification<TEntity> specification)
        {
            return await this.CurrentEntity.FirstOrDefaultAsync<TEntity>(specification.Predicate);
        }

        public IEnumerable<TEntity> GetAll()
        {
            return CurrentEntity;
        }

        public async Task<IEnumerable<TEntity>> FindAllAsync(ISpecification<TEntity> specification)
        {
            return await CurrentEntity.Where<TEntity>(specification.Predicate).ToListAsync();
        }

        /// <summary>
        /// Gets all entities for the passed <param name="identifiers"></param> variable.
        /// </summary>
        /// <param name="identifiers">Guids of type TIdentifier to find."</param>
        /// <returns></returns>
        public IEnumerable<TEntity> GetAll(IEnumerable<TIdentifier> identifiers)
        {
            List<TEntity> results = new List<TEntity>();

            foreach (var i in identifiers)
                results.Add(CurrentEntity.Where<TEntity>(x => x.Id.Equals(i)).FirstOrDefault());
            return results;
        }

        public TEntity Save(TEntity entity)
        {
            this.Update<TEntity>(entity);
            var affected = this.SaveChanges();

            return entity;
        }

        public async Task<TEntity> SaveAsync(TEntity entity)
        {
            this.Update<TEntity>(entity);
            var affected = await this.SaveChangesAsync();

            return entity;
        }

        public async Task<int> DeleteAsync(TIdentifier EntityId)
        {
            var deletedEntity = CurrentEntity.Where<TEntity>(x => x.Id.Equals(EntityId)).FirstOrDefault();

            this.Remove<TEntity>(deletedEntity);
            return await this.SaveChangesAsync(true);
        }

        public async Task<int> DeleteAsync(TEntity entity)
        {
            this.Remove<TEntity>(entity);
            return await this.SaveChangesAsync(true);
        }
    }
}
