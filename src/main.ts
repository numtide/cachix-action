import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run() {
  try {
    // inputs
    const name = core.getInput('name', { required: true });
    const signingKey = core.getInput('signingKey');
    const authToken = core.getInput('authToken')
    const cachixExecutable = "/nix/var/nix/profiles/per-user/runner/profile/bin/cachix";

    core.startGroup('Cachix: installing')
    await exec.exec('nix-env', ['-iA', 'cachix', '-f', 'https://cachix.org/api/v1/install']);
    core.endGroup()

    // for private caches
    if (authToken !== "") {
      await exec.exec(cachixExecutable, ['authtoken', authToken]);
    }

    core.startGroup(`Cachix: using cache ` + name);
    await exec.exec('cachix', ['use', name]);
    core.endGroup();

    if (signingKey !== "") {
      core.exportVariable('CACHIX_SIGNING_KEY', signingKey);
      // Remember existing store paths
      await exec.exec("sh", ["-c", `nix path-info --all | grep -v '\.drv$' > /tmp/store-path-pre-build`]);
    }
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`);
    throw (error);
  }
}

run();
