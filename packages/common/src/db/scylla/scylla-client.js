import { Client } from 'cassandra-driver';

export class ScyllaClient {
  static #client;

  static #config;

  /**
   *
   * @param {ScyllaClientConfig} scyllaConfig The scylla configuration object used for configuring the client instance
   */
  static async init(scyllaConfig) {
    ScyllaClient.#config = scyllaConfig;
    ScyllaClient.#client = new Client({
      contactPoints: scyllaConfig.contactPoints.split(',').map(point => point.trim()),
      localDataCenter: scyllaConfig.localDataCenter
    });
    await ScyllaClient.#connect(ScyllaClient.#client, ScyllaClient.#config);
  }

  /**
   * Connect to the cluster using the client and set up the initial keyspace.
   * @param {Client} client The scylla client.
   * @param {ScyllaClientConfig} config The configuration object.
   */
  static async #connect(client, config) {
    const statement = `
      CREATE KEYSPACE IF NOT EXISTS ${config.keyspace}
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 3};
    `;
    await client.connect();
    await client.execute(statement);
    await client.execute(`USE ${config.keyspace}`);
  }

  /**
   * @returns {Client} The scylla client instance.
   */
  // eslint-disable-next-line class-methods-use-this
  get client() {
    return ScyllaClient.#client;
  }

  /**
   * Executes a parameterized query.
   * @param {string} query The query statement to be executed
   * @param {Object} params The object containing the query parameter values.
   * @param {import('cassandra-driver').QueryOptions} options The additional query options.
   */
  async execute(query, params, options = {}) {
    return this.client.execute(query, params, {
      ...options,
      prepare: true
    });
  }
}

export default ScyllaClient;

/**
 * @typedef {Object} ScyllaClientConfig Configuration object used for configuring the scylla client.
 * @property {string} contactPoints A comma seperated list of Scylla endpoints.
 * @property {string} localDataCenter The local data center to use.
 * @property {string} keyspace The logged keyspace for all the connections created within the client instance.
 */
