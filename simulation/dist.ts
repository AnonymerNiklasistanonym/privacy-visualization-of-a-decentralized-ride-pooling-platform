// Package imports
import fs from 'fs/promises';
import path from 'path';

const srcDir = path.join(__dirname, 'src');
const buildDir = path.join(__dirname, 'build', 'src');
const distDir = path.join(__dirname, 'dist');
const dirsTopCopy = ['views', 'public'];

const copyDir = async (srcDir: string, destDir: string) => {
  await fs.cp(srcDir, destDir, {recursive: true});
  console.debug(`Copy '${srcDir}' to '${destDir}'`);
};

async function main() {
  // Remove old dist directory
  await fs.rm(distDir, {force: true, recursive: true});
  // Copy build directory files
  await copyDir(buildDir, distDir);
  // Copy other assets into dist directory
  for (const dirCopy of dirsTopCopy) {
    await copyDir(path.join(srcDir, dirCopy), path.join(distDir, dirCopy));
  }
}

main().catch(err => console.error(err));
