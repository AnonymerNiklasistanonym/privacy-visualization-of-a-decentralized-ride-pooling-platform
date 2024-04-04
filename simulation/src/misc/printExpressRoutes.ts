// Based on: https://stackoverflow.com/a/46397967

export interface ExpressLayer {
  handle: {stack: ExpressLayer[]};
  method: string;
  name: string;
  params?: string;
  path: string;
  regexp: RegExp;
  route?: {path: string; stack: ExpressLayer[]};
}

export const printRouterPaths = (
  rootLayers: ReadonlyArray<ExpressLayer>,
  rootPath = ''
) => {
  for (const rootLayer of rootLayers) {
    printRouterLayerPaths(rootLayer, [rootPath]);
  }
};

/**
 * Print all paths of the layer
 *
 * @param parentPath Parent path
 * @param layer Child layer
 */
export const printRouterLayerPaths = (
  layer: Readonly<ExpressLayer>,
  parentPath: ReadonlyArray<string> = []
) => {
  if (layer.route) {
    for (const layerRoute of layer.route.stack) {
      printRouterLayerPaths(layerRoute, [
        ...parentPath,
        ...splitPathOrRegexToRoutePaths(layer.route.path),
      ]);
    }
  } else if (layer.name === 'router' && layer.handle.stack) {
    for (const layerHandleRoute of layer.handle.stack) {
      printRouterLayerPaths(layerHandleRoute, [
        ...parentPath,
        ...splitPathOrRegexToRoutePaths(layer.regexp),
      ]);
    }
  } else if (layer.method) {
    console.info(
      layer.method.toUpperCase(),
      [...parentPath, ...splitPathOrRegexToRoutePaths(layer.regexp)].join('/')
    );
  }
};

const splitPathOrRegexToRoutePaths = (pathOrRegex: string | RegExp) => {
  if (typeof pathOrRegex === 'string') {
    return pathOrRegex.split('/').filter(a => a.length > 0);
  } else if (pathOrRegex instanceof RegExp) {
    const match = pathOrRegex
      .toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//);
    return match
      ? match[1]
          .replace(/\\(.)/g, '$1')
          .split('/')
          .filter(a => a.length > 0)
      : ['<complex:' + pathOrRegex.toString() + '>'];
  }
  return [];
};
