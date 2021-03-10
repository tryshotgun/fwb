import { Client } from 'cassandra-driver';
import config from '../config';

const {
  db: {
    scylla: scyllaConfig
  }
} = config;

const client = new Client({
  contactPoints: scyllaConfig.contactPoints.split(',').map(point => point.trim()),
  localDataCenter: scyllaConfig.localDataCenter,
  keyspace: scyllaConfig.keyspace
});

client.execute(`CREATE KEYSPACE IF NOT EXISTS ${scyllaConfig.keyspace} WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 3};`)
  .then(() => `USE ${scyllaConfig.keyspace}`)
  .catch(err => {
    console.error(err);
    throw err;
  });

export default client;
