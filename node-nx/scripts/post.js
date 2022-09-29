module.exports = async (runner, args) => {
  try {
    console.log('> POST: Cleansing (Product):');

    await runner.execute([
      'mv ./secrets.json ./config/secrets.json'
    ], {
      cwd: args.workspacePath
    })

    console.log('> POST: cleansing process ✅ DONE');

  } catch (ex) {
    console.error(ex);
    throw new Error('Failed to run post product script');
  }
}
