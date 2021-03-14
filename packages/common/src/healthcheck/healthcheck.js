/* eslint-disable no-console */
import { createTerminus } from '@godaddy/terminus';
import db from '../db';

export function useHealthCheck(server) {
  createTerminus(server, {
    signal: 'SIGINT',
    healthChecks: {
      '/healthcheck': async function healthcheck() {
        try {
          await db.connect();
          console.info('Connected to cluster with %d host(s): %j', db.hosts.length, db.hosts.keys());
          console.info('Keyspaces: %j', Object.keys(db.metadata.keyspaces));
          return ['liveness', 'readiness'];
        } catch (err) {
          console.error('There was an error when connecting', err);
          await db.shutdown();
          throw err;
        }
      },
    },
    onSignal() {
      // todo, cleanup server resources
    }
  });
}

export default useHealthCheck;
