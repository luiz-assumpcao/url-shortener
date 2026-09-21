import { extractToken } from '../../src/middlewares/auth.middleware.js';

describe('extractToken', () => {
    test('returns null when no header is provided', () => {
        expect(extractToken(undefined)).toBeNull();
    });

    test('returns null when the header does not use the Bearer scheme', () => {
        expect(extractToken('Basic abc123')).toBeNull();
    });

    test('returns null when Bearer has no token after it', () => {
        expect(extractToken('Bearer')).toBeNull();
    });

    test('returns the token when the header is valid', () => {
        expect(extractToken('Bearer abc123')).toBe('abc123');
    });
});
