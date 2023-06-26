// @ts-check
const CosmosClient = require('@azure/cosmos').CosmosClient;
const debug = require('debug')('Flight:FlightUpdateSubscriberDao');

// user data access object
class FlightUpdateSubscriberDao {
  /**
   * Manages reading, adding, and updating Tasks in Azure Cosmos DB
   * @param {CosmosClient} cosmosClient
   * @param {string} databaseId
   * @param {string} containerId
   * @param {string} partitionKey
   */
  constructor(cosmosClient, databaseId, containerId, partitionKey) {
    this.client = cosmosClient;
    this.databaseId = databaseId;
    this.collectionId = containerId;
    this.partitionKey = partitionKey;

    this.database = null;
    this.container = null;
  }

  async init() {
    debug('Setting up the database...');
    const dbResponse = await this.client.databases.createIfNotExists({
      id: this.databaseId,
    });
    this.database = dbResponse.database;
    debug('Setting up the database...done!');
    debug('Setting up the container...');
    const coResponse = await this.database.containers.createIfNotExists({
      id: this.collectionId,
      partitionKey: this.partitionKey
    });
    this.container = coResponse.container;
    debug('Setting up the container...done!');
  }

  async subscribe(item) {
    const { resource: doc } = await this.container.items.create(item);
    return doc;
  }
}

module.exports = FlightUpdateSubscriberDao;
