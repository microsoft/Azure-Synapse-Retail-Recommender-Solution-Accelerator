namespace Contoso.DataAccess.CosmosDB.Sql.ModelBase
{
    public interface IEntityModel<TIdentifier>
    {
        TIdentifier Id { get; set; }
    }
}