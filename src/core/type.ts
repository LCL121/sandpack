export interface PathOption {
  [key: string]: string;
}

export type LoadFunctionOption = (filename: string) => { code: string; id: string } | undefined;

export interface Option {
  path?: PathOption;
  entry: string;
  loadFunction: LoadFunctionOption;
}
