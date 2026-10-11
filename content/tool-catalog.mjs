// Fixed delivery allowlist. Client-supplied paths never become filesystem paths.
export const TOOLS = {
  material_checker: {name:'Material Specification Compliance Checker', page:'tools/material-specification-compliance-checker.html', route:'/tools/material-specification-compliance-checker', card:'materials-quality'},
  material_lookup: {name:'Material Specification Lookup', page:'engineering-tools/grade-specification-lookup/index.html', route:'/engineering-tools/grade-specification-lookup/', card:'material-specification-lookup'},
  steel_explorer: {name:'Steel Phase & Transformation Explorer', page:'tools/steel-phase-explorer.html', route:'/tools/steel-phase-explorer', card:'steel-phase-explorer'}
};
export function assetTool(path) {
  path=path.replace(/^\//,'');
  if (/^tools\/steel-phase-explorer[.-].*\.(js|css)$/.test(path) || /^tools\/steel-phase-explorer\.(js|css)$/.test(path)) return 'steel_explorer';
  if (/^tools\/material-(checker-|specification-).*\.(js|css)$/.test(path)) return 'material_checker';
  return null;
}
export function privateToolPath(path) {
  path=path.replace(/^\//,'');
  return !!assetTool(path) || Object.values(TOOLS).some(tool=>tool.page===path);
}
