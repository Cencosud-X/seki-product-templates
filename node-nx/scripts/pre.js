const { spawn, spawnSync } = require('child_process');

module.exports = (workspacePath) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('> PRE: Installing prerequisites:');

      const targetFolder = workspacePath.substring(workspacePath.lastIndexOf("/") + 1);
      const rootPath = workspacePath.substring(0, workspacePath.lastIndexOf("/"));

      const logFn = (d) => { console.log(d.toString()) };
      const closeFn = (c) => {
        c === 0 ? console.log('> PRE: requisites ✅ DONE') : '';
        c === 0 ? resolve() : reject(new Error('failed to install pre-requisites'))
      };

      console.log(`npx --yes create-nx-workspace@14.4.2 "${targetFolder}" --nxCloud=false --appName=dummy --preset=react --style=less --skipGit=false`);


      const pathToAdd = [`/usr/local/bin`];
      try {
        const result = spawnSync('echo $(nvm which $(nvm current))')
        console.log('stodout', result.stdout.toString())
        console.log('stdErr', result.stderr.toString())
        if (result.stdout.toString().trim().length > 0) {
          result.push(result.stdout.toString())
        }
      } catch (ex) {
        console.log(ex)
      }

      const echoPATH = spawn(`echo $PATH`, { shell: true, cwd: rootPath })
      echoPATH.stdout.on('data', logFn)
      echoPATH.stderr.on('data', logFn)
      echoPATH.on('close', (ec) => { });


      console.log(`${process.env.PATH}:${pathToAdd.join(":")}`);

      // -------------------------------------------------------
      // Install prerequisites and install project via nx
      const createWorkspaceCmd = spawn(`npx --yes create-nx-workspace@14.4.2 "${targetFolder}" --nxCloud=false --appName=dummy --preset=react --style=less --skipGit=false`,
        {
          shell: true,
          cwd: rootPath,
          env: {
            PATH: `${process.env.PATH}:${pathToAdd.join(":")}`,
          }
        })
      createWorkspaceCmd.stdout.on('data', logFn)
      createWorkspaceCmd.stderr.on('data', (message) => {
        logFn("debug code")
        logFn(message)
      })
      createWorkspaceCmd.on('close', (ec) => {

        // some error ocurred in the previous command??
        if (ec !== 0) {
          return closeFn(ec);
        }

        // ------------------------------------------------------- 
        // Remove unused nx extras
        const cleanNxCmd = spawn([
          'npx nx g @nrwl/workspace:rm dummy-e2e',
          'npx nx g @nrwl/workspace:rm dummy'
        ].join(" && "), {
          shell: true,
          cwd: workspacePath,
          env: {
            PATH: `${process.env.PATH}:${pathToAdd.join(":")}`,
          }
        })

        cleanNxCmd.stdout.on('data', logFn);
        cleanNxCmd.stderr.on('data', logFn);
        cleanNxCmd.on('close', closeFn);
        // -------------------------------------------------------
      });


    } catch (ex) {
      reject(ex);
    }
  })
}