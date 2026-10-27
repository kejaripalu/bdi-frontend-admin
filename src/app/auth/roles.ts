import { jwtDecode } from 'jwt-decode';

export const ROLE_GUEST = 'ROLE_GUEST';

/** Reads the `scopes` claim (array, or space separated string) from a JWT. Returns [] for missing/invalid tokens. */
export function rolesFromToken(token: string | null | undefined): string[] {
  if (!token) {
    return [];
  }
  try {
    const scopes = (jwtDecode(token) as { scopes?: unknown }).scopes;
    if (Array.isArray(scopes)) {
      return scopes.filter((s): s is string => typeof s === 'string');
    }
    if (typeof scopes === 'string') {
      return scopes.split(' ').filter(s => s.length > 0);
    }
  } catch {
    // malformed token: treated as having no roles
  }
  return [];
}

/**
 * GUEST may only read (GET). Only a token that is positively a GUEST (and has no other role)
 * is read-only; the server still enforces the real permission with a 403.
 */
export function isReadOnly(roles: string[]): boolean {
  return roles.includes(ROLE_GUEST) && roles.every(role => role === ROLE_GUEST);
}
