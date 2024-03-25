/** @type { import('typedoc').TypeDocOptionMap & import('typedoc-umlclass').Config } */
module.exports = {
  entryPoints: ['./src/index.ts', './src/simulation.ts', './src/**/*.ts'],
  out: 'docs',
  cleanOutputDir: true,
  plugin: ['typedoc-umlclass'],
  umlClassDiagram: {
    type: 'detailed',
    location: 'local',
    format: 'svg',
  },
};
