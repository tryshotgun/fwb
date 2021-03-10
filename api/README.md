# fwb - api

## Requirements:

- docker
- docker-compose

## Getting Started

We use docker-compose to run a container for local Scylla Development.
Documentation for the image can be found [here](https://hub.docker.com/r/scylladb/scylla/).

- Create a copy of the `.env.local` file and rename it to `.env`
- Start the docker dependencies with `docker-compose up -d`
- Start the server with `yarn start`

You may check the health of the server by navigating to the [healthcheck endpoint](http://localhost:3001/healthcheck)