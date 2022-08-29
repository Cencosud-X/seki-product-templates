const { spawn, spawnSync, execSync } = require('child_process');

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


      //if [ -f ~/.bash_profile ]; then source ~/.bash_profile; fi;if [ -f ~/.zshrc ]; then source ~/.zshrc; fi;

      // -------------------------------------------------------
      // Install prerequisites and install project via nx
      const createWorkspaceCmd = spawn(`if [ -f ~/.bash_profile ]; then source ~/.bash_profile; fi && if [ -f ~/.zshrc ]; then source ~/.zshrc; fi; && npx --yes create-nx-workspace@14.4.2 "${targetFolder}" --nxCloud=false --appName=dummy --preset=react --style=less --skipGit=false`,
        {
          shell: true,
          cwd: rootPath
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