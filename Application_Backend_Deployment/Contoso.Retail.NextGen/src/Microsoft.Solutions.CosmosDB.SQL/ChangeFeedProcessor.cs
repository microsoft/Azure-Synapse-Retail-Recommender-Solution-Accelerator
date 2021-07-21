using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.Solutions.CosmosDB.SQL
{
    public class ChangeFeedWatchProssor<TEntity> 
    {
        public async Task<ChangeFeedProcessor> InitChangeFeedProcessorAsync(
                                                                                string DataConnectionString,
                                                                                string SourceDatabaseName,
                                                                                string SourceContainerName,
                                                                                string LeaseContainerName,
                                                                                string PartitionKeyName,
                                                                                Container.ChangesHandler<TEntity> ChangeHandler)
        {
            Container leaseContainer;
            Database database;
            string leaseContainerName = $"{SourceContainerName}_lease";
            var processorName = $"{SourceContainerName}_changefeedwatcher";
            var instanceName = $"{processorName}_host_{Guid.NewGuid().ToString().Substring(0,8)}";

            //Initialize CosmosDB Connection
            CosmosClient cosmosClient = new CosmosClient(DataConnectionString);

            database = cosmosClient.GetDatabase(SourceDatabaseName);
            if (database is null) throw new NullReferenceException("Specified Database doesn't exist");

            leaseContainer = await database.CreateContainerIfNotExistsAsync(leaseContainerName, PartitionKeyName);    
         

            
            ChangeFeedProcessor changeFeedProcessor = database.GetContainer(SourceContainerName)
                .GetChangeFeedProcessorBuilder<TEntity>(processorName: processorName, ChangeHandler)
                    .WithInstanceName(instanceName)
                    .WithLeaseContainer(leaseContainer)
                    .Build();

            Console.WriteLine($"Starting Change Feed Processor...{processorName} in {instanceName}");
            await changeFeedProcessor.StartAsync();
            Console.WriteLine($"Change Feed Processor {processorName} started in {instanceName}");
            return changeFeedProcessor;
        }
    }
}
