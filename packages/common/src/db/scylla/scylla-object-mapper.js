import { mapping } from 'cassandra-driver';

const { Mapper } = mapping;

/**
 * The Mapper that will be used to create ModelMappers for model definitions.
 */
export class ScyllaObjectMapper {
  /** @type {Mapper} The global mapper instance */
  static #mapper;

  #modelName;

  constructor(modelName) {
    this.#modelName = modelName;
  }

  /**
   * Initializes the model mappers provided their model definitions.
   * @param {import('./scylla-client').ScyllaClient} The scylla client instance.
   * @param {import('cassandra-driver').mapping.MappingOptions} The model mapping options.
   */
  static async initModels(scyllaClient, mappingOptions) {
    ScyllaObjectMapper.#mapper = new Mapper(scyllaClient, mappingOptions);
  }

  get() {
    return ScyllaObjectMapper.#mapper.forModel(this.#modelName);
  }
}

export default ScyllaObjectMapper;
