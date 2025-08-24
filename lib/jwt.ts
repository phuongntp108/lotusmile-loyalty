import { SignJWT, jwtVerify, JWTPayload as JoseJwtPayload } from "jose";

// secret key (cần >= 256 bit cho HS256)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "changeme"
);

export interface JwtPayload extends JoseJwtPayload {
  userId: string;
  email: string;
}

// issue token
export async function issueToken(
  payload: JwtPayload,
  expiresIn: string = "1h"
) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

// verify token
export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as JwtPayload;
}

export async function decodeToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JwtPayload;
  } catch (err) {
    console.error(err);
    return null;
  }
}
