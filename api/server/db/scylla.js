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

export default client;
