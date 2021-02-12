using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Contoso.Retail.NextGen.UserProfile
{
    public interface IUserProfileManager
    {
        IEnumerable<Models.UserProfile> GetAllUsers();
        Task<Models.UserProfile> GetUserAsync(string UserID);
        Task<Models.UserProfile> RegisterAsync(Models.UserProfile User);
        Task<bool> RemoveAsync(Guid UserID);
        Task<bool> RemoveAsync(Models.UserProfile User);
        Task<bool> UpdateAsync(Models.UserProfile User);
    }
}