export class PathError extends Error {
  constructor(path: string) {
    super(
      `Path: ${path} doesn't match any functions. Check your environment variable "PATH_MAPPING"`
    );
    this.name = "[PathError]";
  }
}

export class FunctionNotFoundError extends Error {
  constructor(functionName: string) {
    super(`function ${functionName} not found`);
    this.name = "[FunctionNotFoundError]";
  }
}
