using Contoso.DataAccess.CosmosDB.Sql;
using Contoso.DataAccess.CosmosDB.Sql.ModelBase;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Contoso.Retail.NextGen.UserProfile
{
    public class UserProfileManager : CosmosSqlEntityCollectionBase<Models.UserProfile, Guid>, IUserProfileManager
    {
        public UserProfileManager(string DataConnectionString, string CollectionName) : base(DataConnectionString, CollectionName)
        {

        }

        protected override void ModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Models.UserProfile>(e => {
                e.HasPartitionKey(e => e.UserID);
            });

            base.ModelCreating(modelBuilder);
        }

        public async Task<Models.UserProfile> RegisterAsync(Models.UserProfile User)
        {
            var affectedRows = await ObjectCollection.AddAsync(User);

            return User;
        }

        public async Task<Models.UserProfile> GetUserAsync(string UserID)
        {
            return await ObjectCollection.FindAsync(new GenericSpecification<Models.UserProfile>(x => x.UserID == UserID));
        }

        public IEnumerable<Models.UserProfile> GetAllUsers()
        {

            return ObjectCollection.GetAll();
        }

        public async Task<bool> UpdateAsync(Models.UserProfile User)
        {
            await ObjectCollection.SaveAsync(User);
            return true;
        }

        public async Task<bool> RemoveAsync(Models.UserProfile User)
        {
            var result = await ObjectCollection.DeleteAsync(User);
            return (result > 0);
        }

        public async Task<bool> RemoveAsync(Guid UserID)
        {
            var result = await ObjectCollection.DeleteAsync(UserID);
            return (result > 0);
        }
            
    }
}
