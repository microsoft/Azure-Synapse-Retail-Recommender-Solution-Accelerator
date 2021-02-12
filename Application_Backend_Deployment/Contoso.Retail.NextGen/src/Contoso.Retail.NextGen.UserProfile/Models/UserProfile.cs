using Contoso.DataAccess.CosmosDB.Sql.ModelBase;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contoso.Retail.NextGen.UserProfile.Models
{
    //public class UserProfile : IEntityModel<Guid>
    //{
    //    public UserProfile()
    //    {
    //        Id = Guid.NewGuid();
    //    }

    //    public Guid Id { get; set; }
    //    public string UserID { get; set; }
    //    public string Name { get; set; }
    //    public string ProfileImageURL { get; set; }
    //}

    public class UserProfile : IEntityModel<Guid>, IDisposable
    {
        public UserProfile()
        {
            Id = Guid.NewGuid();
        }

        public Guid Id { get; set; }
        public string UserID { get; set; }
        public string Name { get; set; }
        public string ProfileImageURL { get; set; }

        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
    }
}
