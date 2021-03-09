export default {
  db: {
    scylla: {
      keyspace: process.env.DB_SCYLLA_KEYSPACE,
      localDataCenter: process.env.DB_SCYLLA_LOCAL_DATA_CENTER,
      contactPoints: process.env.DB_SCYLLA_CONTACT_POINTS,
    },
  }
};
