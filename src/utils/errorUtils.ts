export class CustomError extends Error {
    constructor(public message: string, public code: number = 400) {
      super(message);
      this.name = this.constructor.name;
    }
  }
  
  // Throw a new custom error
  export const throwError = (message: string, code: number = 400) => {
    throw new CustomError(message, code);
  };
  