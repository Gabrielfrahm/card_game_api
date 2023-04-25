export interface AuthenticationInterface {
  generateToken(payload: any, options?: any): string;
  validateToken(token: string, options?: any): any;
}
