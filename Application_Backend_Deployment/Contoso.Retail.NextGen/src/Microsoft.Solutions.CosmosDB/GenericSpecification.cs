using System;
using System.Linq.Expressions;

namespace Microsoft.Solutions.CosmosDB
{
    public class GenericSpecification<TEntity> : ISpecification<TEntity>
    {
        public GenericSpecification(Expression<Func<TEntity,bool>> predicate, Expression<Func<TEntity,dynamic>> orderBy = null, Order order = Order.Asc)
        {
            Predicate = predicate;
            OrderBy = orderBy;
            Order = order;
        }

        /// <summary>
        /// Gets or sets the func delegate query to execute against the repository for searching records.
        /// </summary>
        public Expression<Func<TEntity, bool>> Predicate { get; }
        public Expression<Func<TEntity, dynamic>> OrderBy { get; }
        public Order Order { get; }
    }

    public enum Order
    {
        Asc,
        Desc
    }
}