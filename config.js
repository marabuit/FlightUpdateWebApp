require('dotenv-flow').config();

const config = {};

config.databaseId = process.env.COSMOSDB_DATABASE || "MarabuDB";
config.containerId = process.env.COSMOSDB_CONTAINER || "FlightUpdateSubscribers";
config.partitionKey = process.env.COSMOSDB_PARTITIONKEY || "/flightNumber";
config.cosmosDBConnectionString = process.env.COSMOSDB_CONNECTIONSTRING;

module.exports = config;
