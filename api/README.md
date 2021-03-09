# fwb - api

## Requirements:

- docker
- docker-compose

## Getting Started

We use docker-compose to run a container for local Scylla Development.
Documentation for the image can be found [here](https://hub.docker.com/r/scylladb/scylla/).

- Create a copy of the `.env.local` file and rename it to `.env`
- Start the docker dependencies with `docker-compose up -d`
- When running the service for the first time, we need a default keyspace for the DB created. this can be done by executing:
  - `docker exec -it scylla-local-1 cqlsh`
  - `CREATE KEYSPACE api WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 3};`

You may check the health of the server by navigating to the [healthcheck endpoint](http://localhost:3001/healthcheck)