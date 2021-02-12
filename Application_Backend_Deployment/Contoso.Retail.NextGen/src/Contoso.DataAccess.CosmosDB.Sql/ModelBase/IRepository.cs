using System.Collections.Generic;
using System.Threading.Tasks;

namespace Contoso.DataAccess.CosmosDB.Sql.ModelBase
{
    public interface IRepository<TEntity, in TIdentifier>
    {
        Task<TEntity> Get(TIdentifier id);

        IEnumerable<TEntity> GetAll();

        TEntity Save(TEntity entity);

        Task<TEntity> SaveAsync(TEntity entity);

        Task<int> AddAsync(TEntity entity);


        Task<int> DeleteAsync(TIdentifier id);

        Task<int> DeleteAsync(TEntity entity);

        IEnumerable<TEntity> GetAll(IEnumerable<TIdentifier> identifiers);

        Task<TEntity> FindAsync(ISpecification<TEntity> specification);

        Task<IEnumerable<TEntity>> FindAllAsync(ISpecification<TEntity> specification);
    }
}