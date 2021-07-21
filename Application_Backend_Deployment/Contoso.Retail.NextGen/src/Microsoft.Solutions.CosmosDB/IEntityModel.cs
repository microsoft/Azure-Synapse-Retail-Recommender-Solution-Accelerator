using System;

namespace Microsoft.Solutions.CosmosDB
{
    public interface IEntityModel<TIdentifier> 
    {
        TIdentifier id { get; set; }
        string __partitionkey { get; set; }
    }
}