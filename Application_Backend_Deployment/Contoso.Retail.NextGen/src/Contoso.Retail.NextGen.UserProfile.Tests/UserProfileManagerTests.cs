using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Linq;
using Contoso.Test.MSTestV2;
using System.Threading.Tasks;
using Contoso.DataAccess.CosmosDB.Sql;

namespace Contoso.Retail.NextGen.UserProfile.Tests
{
    [TestClass()]
    public class UserProfileManagerTests : TestBase
    {

        private UserProfileManager _profile;
        static Models.UserProfile newUser;

        [TestInitialize()]
        public void Initialize()
        {
            _profile = new UserProfileManager(Config["Values:DBConnectionString"], "Application");
        }

        [TestMethod()]
        public async Task Test01_RegisterTest()
        {
            var result = await _profile.RegisterAsync(
                new Models.UserProfile()
                {
                    Name = "Foo",
                    UserID = "1010101",
                    ProfileImageURL = "http://foo.com/foo.jpg"
                });

            newUser = new Models.UserProfile() { Id = result.Id, Name = result.Name, ProfileImageURL = result.ProfileImageURL, UserID = result.UserID };
            Assert.IsNotNull(result);
        }


        [TestMethod()]
        public async Task Test02_GetUserTest()
        {
            var result = await _profile.GetUserAsync(newUser.UserID);
            Assert.IsTrue(result.UserID == newUser.UserID);
        }

        [TestMethod()]
        public void Test03_GetAllUsersTest()
        {
            var result = _profile.GetAllUsers();
            
            foreach (var item in result)
            {
                System.Console.WriteLine($"Name : {item.Name}, Id : {item.Id}");
            }

            int rows = result.Count();
            Assert.IsTrue(rows > 0);
        }


        [TestMethod()]
        public async Task Test04_UpdateTest()
        {
            newUser.Name = "updated Name";
            await _profile.UpdateAsync(newUser);

            var user = await _profile.GetUserAsync(newUser.UserID);

            Assert.IsTrue(user.Name == "updated Name");
        }


        [TestMethod()]
        public async Task Test05_RemoveTest()
        {
            var result = await _profile.RemoveAsync(newUser);

            Assert.IsTrue(result);
        }



    }


}