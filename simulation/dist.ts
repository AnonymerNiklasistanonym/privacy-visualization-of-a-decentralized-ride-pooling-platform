/* eslint-disable no-console */

// Package imports
import fs from 'fs/promises';
import path from 'path';
// eslint-disable-next-line node/no-unpublished-import
import {createGenerator} from 'ts-json-schema-generator';
// Type imports
// eslint-disable-next-line node/no-unpublished-import
import type {Config} from 'ts-json-schema-generator';

const srcDir = path.join(__dirname, 'src');
const buildDir = path.join(__dirname, 'build', 'src');
const distDir = path.join(__dirname, 'dist');
const dirsTopCopy = ['views', 'public'];

const tsconfigFilePath = path.join(__dirname, 'tsconfig.json');
const jsonSchemaFilePath = path.join(__dirname, 'config.schema.json');
const jsonSchemaInternalFilePath = path.join(distDir, 'config.schema.json');
const simulationConfigFilePath = path.join(
  srcDir,
  'config',
  'simulationConfig.ts'
);

const copyDir = async (srcDir: string, destDir: string) => {
  await fs.cp(srcDir, destDir, {recursive: true});
  console.debug(`Copy '${srcDir}' to '${destDir}'`);
};

const copyFile = async (srcFile: string, destFile: string) => {
  await fs.cp(srcFile, destFile);
  console.debug(`Copy '${srcFile}' to '${destFile}'`);
};

const createJsonSchema = async () => {
  const config: Config = {
    path: simulationConfigFilePath,
    tsconfig: tsconfigFilePath,
    type: 'SimulationConfigCustom',
  };
  const schema = createGenerator(config).createSchema(config.type);
  await fs.writeFile(jsonSchemaFilePath, JSON.stringify(schema, null, 4));
};

async function main() {
  // Create JSON schema
  await createJsonSchema();
  // Remove old dist directory
  await fs.rm(distDir, {force: true, recursive: true});
  // Copy build directory files
  await copyDir(buildDir, distDir);
  // Copy other assets into dist directory
  for (const dirCopy of dirsTopCopy) {
    await copyDir(path.join(srcDir, dirCopy), path.join(distDir, dirCopy));
  }
  // Copy JSON schema
  await copyFile(jsonSchemaFilePath, jsonSchemaInternalFilePath);
}

main().catch(err => console.error(err));
