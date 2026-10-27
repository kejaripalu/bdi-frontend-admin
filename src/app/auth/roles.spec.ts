import { isReadOnly, rolesFromToken } from './roles';

function tokenWith(payload: object): string {
  const encode = (value: object) => btoa(JSON.stringify(value)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(payload)}.sig`;
}

describe('roles', () => {
  it('reads scopes from a JWT array claim', () => {
    expect(rolesFromToken(tokenWith({ sub: 'u', scopes: ['ROLE_SUPERADMIN'] }))).toEqual(['ROLE_SUPERADMIN']);
  });

  it('reads scopes from a space separated string claim', () => {
    expect(rolesFromToken(tokenWith({ scopes: 'ROLE_USER ROLE_ADMIN' }))).toEqual(['ROLE_USER', 'ROLE_ADMIN']);
  });

  it('returns no roles for missing, empty or malformed tokens', () => {
    expect(rolesFromToken(null)).toEqual([]);
    expect(rolesFromToken('')).toEqual([]);
    expect(rolesFromToken('not-a-jwt')).toEqual([]);
    expect(rolesFromToken(tokenWith({ sub: 'u' }))).toEqual([]);
  });

  it('treats only a GUEST-only session as read-only', () => {
    expect(isReadOnly(['ROLE_GUEST'])).toBeTrue();
    expect(isReadOnly(['ROLE_USER'])).toBeFalse();
    expect(isReadOnly(['ROLE_ADMIN'])).toBeFalse();
    expect(isReadOnly(['ROLE_SUPERADMIN'])).toBeFalse();
    expect(isReadOnly(['ROLE_GUEST', 'ROLE_USER'])).toBeFalse();
    expect(isReadOnly([])).toBeFalse();
  });
});
