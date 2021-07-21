using Microsoft.Azure.Cosmos;
using Microsoft.Solutions.CosmosDB;

namespace Microsoft.Solutions.CosmosDB.SQL
{
    public class SQLEntityCollectionBase<TEntity, String> where TEntity : class, IEntityModel<String>
    {
        protected IRepository<TEntity, String> ObjectCollection;

        public SQLEntityCollectionBase(string DataConnectionString, string CollectionName, string ContainerName = "")
        {
            CosmosClient _client = new CosmosClient(DataConnectionString);

            this.ObjectCollection = new BusinessTransactionRepository<TEntity, String>(_client,
                CollectionName, ContainerName);
            
        }

    }
}
