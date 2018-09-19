import { workspace, RelativePattern } from "vscode";

export default async function getNonExcludedFiles() {
  // TODO: https://github.com/TomasHubelbauer/vscode-extension-findFilesWithExcludes
  // TODO: https://github.com/Microsoft/vscode/issues/48674
  const excludes = await workspace.getConfiguration('search', null).get('exclude')!;
  const globs = Object.keys(excludes).map(exclude => new RelativePattern(workspace.workspaceFolders![0], exclude));
  const occurences = new Map<string, number>();
  for (const glob of globs) {
    // TODO: https://github.com/Microsoft/vscode/issues/47645
    for (const file of await workspace.findFiles('**/*.*', glob)) {
      // Use `fsPath` to not get the leading slash
      occurences.set(file.fsPath, (occurences.get(file.fsPath) || 0) + 1);
    }
  }

  // Accept only files not excluded in any of the globs
  return [...occurences.keys()].filter(path => occurences.get(path) === globs.length);
}
