export interface User {
  id: string;
  email?: string | undefined;
  role?: string | undefined;
  // other user properties
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}