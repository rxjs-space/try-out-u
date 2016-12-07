// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
import { envCommon } from './environment.common';

const envDev = {
  production: false,
}
export const environment = Object.assign(envDev, envCommon);



/*
for cstate, refer to doc: https://developer.github.com/v3/oauth/
state is an unguessable random string. 
It is used to protect against cross-site request forgery attacks.

*/
