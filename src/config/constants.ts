export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
};

export interface JwtPayload {
  username: string;
  sub: number; // 'sub' is the user ID. Use 'string' if your ID is a UUID/string.
}
