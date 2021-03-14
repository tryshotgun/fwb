# @fwb/common

Common libraries to be used by the fwb services.

## Getting Started


### Usage
```js

const validConfig = {
  contactPoints: `localhost:1234,localhost:4321`,
  localDataCenter: 'datacenter1',
  keyspace: 'keyspace'
};

await ScyllaClient.init(validConfig);

await new ScyllaClient().execute('SELECT * FROM table WHERE table.id = :id', { id: 1 });
```

## Development

### Peer Dependencies

- Docker