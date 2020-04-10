import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run() {
  try {
    // inputs
    const name = core.getInput('name', { required: true });
    const signingKey = core.getInput('signingKey');
    const cachixExecutable = "/nix/var/nix/profiles/per-user/runner/profile/bin/cachix";

    if (signingKey !== "") {
      core.startGroup('Cachix: pushing paths');
      await exec.exec("sh", ["-c", `nix path-info --all | grep -v '\.drv$' | cat - /tmp/store-path-pre-build | sort | uniq -u  | ${cachixExecutable} push ${name}`]);
      core.endGroup();
    }
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`);
    throw (error);
  }
}

run();
