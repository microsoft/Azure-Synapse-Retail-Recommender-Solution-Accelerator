using System;
using System.Linq.Expressions;

namespace Contoso.DataAccess.CosmosDB.Sql.ModelBase
{
    public interface ISpecification<TEntity>
    {
        /// <summary>
        /// Gets or sets the func delegate query to execute against the repository for searching records.
        /// </summary>
        Expression<Func<TEntity, bool>> Predicate { get; }
    }
}
