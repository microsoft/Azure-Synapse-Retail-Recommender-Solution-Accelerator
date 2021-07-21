using System.Collections.Generic;
using System.Threading.Tasks;

namespace Microsoft.Solutions.CosmosDB
{
    public interface IRepository<TEntity, in TIdentifier>
    {
        Task<TEntity> AddAsync(TEntity entity);

        Task DeleteAsync(TEntity entity, dynamic partitonKeyValue = null);
        Task DeleteAsync(TIdentifier entityId, dynamic partitionKeyValye = null);
        Task<TEntity> FindAsync(ISpecification<TEntity> specification);
        Task<IEnumerable<TEntity>> FindAllAsync(ISpecification<TEntity> specification);
        Task<TEntity> Get(TIdentifier id);
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task<IEnumerable<TEntity>> GetAllAsync(IEnumerable<TIdentifier> identifiers);
        Task<TEntity> SaveAsync(TEntity entity);
    }
}