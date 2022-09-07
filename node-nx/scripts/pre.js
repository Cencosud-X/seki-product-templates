module.exports = async (runner, args) => {
  try {
    console.log('> PRE: Installing prerequisites:');

    const workspacePath = args.workspacePath;
    const targetFolder = workspacePath.substring(workspacePath.lastIndexOf("/") + 1);
    const rootPath = workspacePath.substring(0, workspacePath.lastIndexOf("/"));

    await runner.execute(`npx create-nx-workspace@14.4.2 "${targetFolder}" --nxCloud=false --appName=dummy --preset=react --style=less --skipGit=false --yes`, {
      cwd: rootPath
    })
    await runner.execute([
      'npx nx g @nrwl/workspace:rm dummy-e2e',
      'npx nx g @nrwl/workspace:rm dummy'
    ], {
      cwd: workspacePath
    })

    console.log('> PRE: requisites ✅ DONE')

  } catch (ex) {
    throw new Error('Failed to install pre-requisites');
  }
}