/** @type { import('typedoc').TypeDocOptionMap & import('typedoc-umlclass').Config } */
module.exports = {
  cleanOutputDir: true,
  entryPoints: ['./src/index.ts', './src/simulation.ts', './src/**/*.ts'],
  out: 'docs',
  plugin: ['typedoc-umlclass'],
  umlClassDiagram: {
    format: 'svg',
    location: 'local',
    type: 'detailed',
  },
};
