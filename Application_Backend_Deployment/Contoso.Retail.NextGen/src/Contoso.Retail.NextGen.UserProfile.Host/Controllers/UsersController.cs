using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Contoso.Retail.NextGen.UserProfile.Host.Controllers
{
    [Route("ContosoRetail/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IUserProfileManager profileManager;

        public UsersController(IUserProfileManager ProfileManager)
        {
            profileManager = ProfileManager;
        }

        [HttpGet]
        public IEnumerable<Models.UserProfile> Get()
        {
            return profileManager.GetAllUsers();
        }

        [HttpGet("{UserId}")]
        public async Task<Models.UserProfile> Get(string UserId)
        {
            return await profileManager.GetUserAsync(UserId);
        }

        [HttpPost]
        public async Task<Models.UserProfile> Post([FromBody] Models.UserProfile userProfile)
        {
            return await profileManager.RegisterAsync(userProfile);
        }

        [HttpPut]
        public async Task<bool> Put([FromBody] Models.UserProfile userProfile)
        {
            return await profileManager.UpdateAsync(userProfile);
        }

        [HttpDelete("{UserId}")]
        public async Task<bool> Delete(Guid UserId)
        {
            return await profileManager.RemoveAsync(UserId);
        }
    }
}
