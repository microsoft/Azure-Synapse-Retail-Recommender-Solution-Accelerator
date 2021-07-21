using System;
using System.Linq.Expressions;

namespace Microsoft.Solutions.CosmosDB
{
    public interface ISpecification<TEntity>
    {
        /// <summary>
        /// Gets or sets the func delegate query to execute against the repository for searching records.
        /// </summary>
        Expression<Func<TEntity, bool>> Predicate { get; }
        Expression<Func<TEntity, dynamic>> OrderBy { get; }
    }
}
