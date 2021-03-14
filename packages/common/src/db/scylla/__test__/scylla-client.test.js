import { GenericContainer, Wait } from 'testcontainers';
import { ScyllaClient } from '../scylla-client';

const CONTAINER_PORT = 9042;

describe('ScyllaClient', () => {
  let container;
  let validConfig;

  beforeAll(async () => {
    jest.setTimeout(40 * 1000);
    container = await new GenericContainer('scylladb/scylla')
      .withExposedPorts(CONTAINER_PORT)
      .withWaitStrategy(Wait.forLogMessage('initialization completed.'))
      .start();

    validConfig = {
      contactPoints: `${container.getHost()}:${container.getMappedPort(CONTAINER_PORT)}`,
      localDataCenter: 'datacenter1',
      keyspace: 'common_test'
    };

    await ScyllaClient.init(validConfig);
  });

  afterAll(async () => {
    await container.stop();
    await ScyllaClient.close();
    jest.setTimeout(5000);
  });

  test('consumes the config to create a client connection', async () => {
    const scylla = new ScyllaClient();
    expect(scylla.client.hosts).toHaveLength(validConfig.contactPoints.split(',').length);
    expect(scylla.client.hosts.keys()[0]).toContain(validConfig.contactPoints.split(':')[1]);

    const result = await scylla.client.execute('SELECT * FROM system_schema.keyspaces');
    expect(result.rows.map(row => row.keyspace_name)).toContain(validConfig.keyspace);
  });

  test('instances share the global client instance', () => {
    const { client } = new ScyllaClient();
    expect(client).toBeDefined();
    expect(client).toBe(new ScyllaClient().client);
  });

  describe('#execute', () => {
    test('parameterizes named parameters by default', async () => {
      const query = 'SELECT * FROM system_schema.keyspaces WHERE keyspace_name = :name';
      const result = await new ScyllaClient().execute(query, { name: validConfig.keyspace });
      expect(result.rowLength).toBe(1);
      expect(result.first().get('keyspace_name')).toBe(validConfig.keyspace);
    });
  });
});
