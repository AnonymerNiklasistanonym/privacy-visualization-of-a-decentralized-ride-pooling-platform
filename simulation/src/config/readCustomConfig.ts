// Package imports
import Ajv from 'ajv';
import fs from 'fs/promises';
// Type imports
import type {
  SimulationConfig,
  SimulationConfigCustom,
} from './simulationConfig';

export const throwErrorIfWrongType = (
  name: string,
  element: unknown,
  expectedType: string
) => {
  if (typeof element !== expectedType) {
    throw Error(
      `Expected custom config ${name} to be ${expectedType}! (found ${typeof element})`
    );
  }
};

export const readCustomConfig = async (
  filePath: string,
  filePathJsonSchema: string
): Promise<Partial<SimulationConfig>> => {
  const content = await fs.readFile(filePath, {encoding: 'utf-8'});
  const contentJsonSchema = await fs.readFile(filePathJsonSchema, {
    encoding: 'utf-8',
  });
  const customConfig = JSON.parse(content) as SimulationConfigCustom;
  const configJsonSchema = JSON.parse(contentJsonSchema);

  const ajv = new Ajv();
  const validateCustomConfig = ajv.compile(configJsonSchema);

  if (validateCustomConfig(customConfig)) {
    return customConfig;
  }
  throw Error(
    `Validation of custom config had error: ${JSON.stringify(
      validateCustomConfig.errors
    )}`
  );
};
