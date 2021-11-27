interface PathOption {
  [key: string]: string;
}

interface EntryOption {
  code: string;
  fileId: string;
}

interface Option {
  path: PathOption;
  entry: EntryOption;
  loadFunction: (filename: string) => string;
}

export default function (option: Option): string {
  return '';
}
