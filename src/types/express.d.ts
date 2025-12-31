import { UserResponse } from "./responses/user-response";

declare global {
  namespace Express {
    interface Request {
      user?: UserResponse;
    }
  }
}

export {};
