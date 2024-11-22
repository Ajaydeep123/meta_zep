declare global {
    namespace Express {
      export interface Request {
        role?: "Admin" | "User";
        userId?: string;
      }
    }
}