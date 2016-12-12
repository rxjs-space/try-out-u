/* tslint:disable:no-unused-variable */
// Typings reference file, you can add your own global typings here
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

// declare namespace Reflect {
//     const getMetadata: any; // this one is used to get the annotation of component in shared/pipes/log-it.pipe
// }


declare var System: SystemJS;

interface SystemJS {
  import: (path?: string) => Promise<any>;
}
// Extra variables that live on Global that will be replaced by webpack DefinePlugin
declare var ENV: string;
declare var HMR: boolean;
declare var Zone: {current: any};
interface GlobalEnvironment {
  ENV;
  HMR;
  SystemJS: SystemJS;
  System: SystemJS;
}