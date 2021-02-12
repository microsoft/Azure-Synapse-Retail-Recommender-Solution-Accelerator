using Contoso.Retail.NextGen.ProductManagement.Proxy;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Contoso.Retail.NextGen.PurchaseHistory
{
    public interface IPurchaseHistoryService
    {
        Task<IEnumerable<Product>> GetHistory(string UserID);
    }
}