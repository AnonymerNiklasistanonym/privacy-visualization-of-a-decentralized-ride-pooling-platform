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

export const getExpressRoutes = (
  rootLayers: ReadonlyArray<ExpressLayer>,
  rootPath = ''
) => {
  const paths: string[] = [];
  for (const rootLayer of rootLayers) {
    paths.push(...getRouterLayerPaths(rootLayer, [rootPath]));
  }
  return paths.sort();
};

/**
 * Print all paths of the layer
 *
 * @param parentPath Parent path
 * @param layer Child layer
 */
export const getRouterLayerPaths = (
  layer: Readonly<ExpressLayer>,
  parentPath: ReadonlyArray<string> = []
): string[] => {
  const paths: string[] = [];
  if (layer.route) {
    for (const layerRoute of layer.route.stack) {
      paths.push(
        ...getRouterLayerPaths(layerRoute, [
          ...parentPath,
          ...splitPathOrRegexToRoutePaths(layer.route.path),
        ])
      );
    }
  } else if (layer.name === 'router' && layer.handle.stack) {
    for (const layerHandleRoute of layer.handle.stack) {
      paths.push(
        ...getRouterLayerPaths(layerHandleRoute, [
          ...parentPath,
          ...splitPathOrRegexToRoutePaths(layer.regexp),
        ])
      );
    }
  } else if (layer.method) {
    paths.push(
      `${layer.method.toUpperCase()} ${[
        ...parentPath,
        ...splitPathOrRegexToRoutePaths(layer.regexp),
      ].join('/')}`
    );
  }
  return paths;
};

const splitPathOrRegexToRoutePaths = (
  pathOrRegex: string | RegExp
): string[] => {
  if (typeof pathOrRegex === 'string') {
    return pathOrRegex.split('/').filter(a => a.length > 0);
  } else if (pathOrRegex instanceof RegExp) {
    const match = pathOrRegex
      .toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//);
    if (match) {
      return match[1]
        .replace(/\\(.)/g, '$1')
        .split('/')
        .filter(a => a.length > 0);
    }
    return ['<complex:' + pathOrRegex.toString() + '>'];
  }
  return [];
};
