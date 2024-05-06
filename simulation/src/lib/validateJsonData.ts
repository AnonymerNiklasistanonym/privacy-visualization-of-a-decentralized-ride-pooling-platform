// Package imports
import Ajv from 'ajv';
import fs from 'fs/promises';
// Type imports
import {ErrorObject, JSONSchemaType, SchemaObject} from 'ajv';

export class ValidationError extends Error {
  public errors: null | ErrorObject[];
  constructor(message: string, errors: undefined | null | ErrorObject[]) {
    super(message);
    this.errors = errors ?? null;
  }
}

export const validateJsonDataFile = async <T>(
  filePathJsonData: string,
  filePathJsonSchema: string
): Promise<T> => {
  const contentJsonData = await fs.readFile(filePathJsonData, {
    encoding: 'utf-8',
  });
  const contentJsonSchema = await fs.readFile(filePathJsonSchema, {
    encoding: 'utf-8',
  });
  return validateJsonData(
    JSON.parse(contentJsonData) as T,
    JSON.parse(contentJsonSchema)
  );
};

export const validateJsonData = async <T>(
  jsonData: T,
  jsonSchema: SchemaObject | JSONSchemaType<T>
): Promise<T> => {
  const ajv = new Ajv();
  const validateCustomConfig = ajv.compile(jsonSchema);

  if (validateCustomConfig(jsonData)) {
    return jsonData;
  }
  throw new ValidationError(
    `Validation of custom config had error: ${
      validateCustomConfig.errors !== null &&
      validateCustomConfig.errors !== undefined
        ? validateCustomConfig.errors.map(a => a.message).join(', ')
        : 'Unknown'
    }`,
    validateCustomConfig.errors
  );
};
