using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Microsoft.Solutions.CosmosDB;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Microsoft.Solutions.CosmosDB.SQL
{

    public class BusinessTransactionRepository<TEntity, TIdentifier> : IRepository<TEntity, TIdentifier> where TEntity : class, IEntityModel<TIdentifier>
    {

        private readonly Database _database;
        private readonly Container _container;

        public BusinessTransactionRepository(CosmosClient client, string DatabaseName, string containerName = "")
        {
            _database = client.CreateDatabaseIfNotExistsAsync(DatabaseName).Result;

            if (string.IsNullOrEmpty(containerName))
            {
                _container = _database.CreateContainerIfNotExistsAsync(typeof(TEntity).Name + "s", "/__partitionkey").Result;
            }
            else
            {
                _container = _database.GetContainer(containerName);
            }
        }


        public async Task<TEntity> Get(TIdentifier id)
        {
            var iterator = this._container.GetItemQueryIterator<TEntity>($"select * from c where c.id = '{id.ToString()}'");
            if (iterator.HasMoreResults)
            {
                return (await iterator.ReadNextAsync()).FirstOrDefault<TEntity>();

            }
            else
            {
                return null;
            }
        }

        public async Task<TEntity> AddAsync(TEntity entity)
        {
            var result = await this._container.CreateItemAsync<TEntity>(entity);
            return result.Resource;
        }

        public async Task<TEntity> FindAsync(ISpecification<TEntity> specification)
        {
            GenericSpecification<TEntity> genericSpecification = specification as GenericSpecification<TEntity>;

            FeedIterator<TEntity> iterator = null;

            if(genericSpecification.OrderBy == null)
            {
                iterator = this._container.GetItemLinqQueryable<TEntity>().Where(specification.Predicate).ToFeedIterator();
            } else if(genericSpecification.Order == Order.Asc) 
            {
                iterator = this._container.GetItemLinqQueryable<TEntity>().Where(specification.Predicate).OrderBy(specification.OrderBy).ToFeedIterator();
            } else if(genericSpecification.Order == Order.Desc) 
            {
                iterator = this._container.GetItemLinqQueryable<TEntity>().Where(specification.Predicate).OrderByDescending(specification.OrderBy).ToFeedIterator();
            }

            if (iterator.HasMoreResults)
            {
                return (await iterator.ReadNextAsync()).FirstOrDefault();

            }
            else
            {
                return null;
            }
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            //return CurrentEntity;
            var iterator = this._container.GetItemLinqQueryable<TEntity>().ToFeedIterator();

            List<TEntity> results = new List<TEntity>();

            while (iterator.HasMoreResults)
            {
                var response = await iterator.ReadNextAsync();
                foreach (var item in response)
                {
                    results.Add(item);
                }
            }

            return results;
        }

        public async Task<IEnumerable<TEntity>> FindAllAsync(ISpecification<TEntity> specification)
        {
            GenericSpecification<TEntity> genericSpecification = specification as GenericSpecification<TEntity>;

            FeedIterator<TEntity> iterator = null;

            if (genericSpecification.OrderBy == null)
            {
                iterator = this._container.GetItemLinqQueryable<TEntity>().Where(specification.Predicate).ToFeedIterator();
            }
            else
            {
                if (genericSpecification.Order == Order.Asc)
                {
                    iterator = this._container.GetItemLinqQueryable<TEntity>().Where(specification.Predicate).OrderBy(specification.OrderBy).ToFeedIterator();
                } else { 
                    iterator = this._container.GetItemLinqQueryable<TEntity>().Where(specification.Predicate).OrderByDescending(specification.OrderBy).ToFeedIterator();
                }
            }

            List<TEntity> results = new List<TEntity>();

            while (iterator.HasMoreResults)
            {
                var response = await iterator.ReadNextAsync();
                foreach (var item in response)
                {
                    results.Add(item);
                }
            }

            return results;
        }

        /// <summary>
        /// Gets all entities for the passed <param name="identifiers"></param> variable.
        /// </summary>
        /// <param name="identifiers">Guids of type TIdentifier to find."</param>
        /// <returns></returns>
        public async Task<IEnumerable<TEntity>> GetAllAsync(IEnumerable<TIdentifier> identifiers)
        {
            List<TEntity> results = new List<TEntity>();

            foreach (var id in identifiers)
            {
                var iterator = this._container.GetItemLinqQueryable<TEntity>().Where(x => x.id.Equals(id)).ToFeedIterator();

                while (iterator.HasMoreResults)
                {
                    var response = await iterator.ReadNextAsync();
                    foreach (var item in response)
                    {
                        results.Add(item);
                    }
                }
            }
            return results;
        }

        public async Task<TEntity> SaveAsync(TEntity entity)
        {
            var result = await this._container.ReplaceItemAsync<TEntity>(entity, entity.id.ToString());
            return result.Resource;

        }

        public async Task DeleteAsync(TIdentifier EntityId, dynamic partitionKeyValue = null)
        {
            var cosmosEntity = await this.Get(EntityId) as CosmosDBEntityBase;
            if (partitionKeyValue == null)
            {
                await this._container.DeleteItemAsync<TEntity>(EntityId.ToString(), new PartitionKey(cosmosEntity.__partitionkey));
            } else
            {
                await this._container.DeleteItemAsync<TEntity>(EntityId.ToString(), new PartitionKey(partitionKeyValue));
            }
            

        }

        public async Task DeleteAsync(TEntity entity, dynamic partitionKeyValue = null)
        {
            var cosmosEntity = entity as CosmosDBEntityBase;
            if (partitionKeyValue == null)
            {
                await this._container.DeleteItemAsync<TEntity>(entity.id.ToString(), new PartitionKey(cosmosEntity.__partitionkey));
            } else
            {
                await this._container.DeleteItemAsync<TEntity>(entity.id.ToString(), new PartitionKey(partitionKeyValue));
            }
            
        }

        public TEntity Find(ISpecification<TEntity> specification)
        {
            return this._container.GetItemLinqQueryable<TEntity>().Where(specification.Predicate).FirstOrDefault();
        }
    }


}
