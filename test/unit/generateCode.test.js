import { generateCode } from '../../src/controllers/url.controllers.js';

describe('generateCode', () => {
    test('returns a string', () => {
        expect(typeof generateCode()).toBe('string');
    });

    test('returns a string of length 6', () => {
        expect(generateCode()).toHaveLength(6);
    });

    test('contains only lowercase letters and digits', () => {
        expect(generateCode()).toMatch(/^[a-z0-9]+$/);
    });

    test('returns different values across multiple calls', () => {
        const codes = new Set();
        for (let i = 0; i < 20; i++) {
            codes.add(generateCode());
        }
        expect(codes.size).toBeGreaterThan(1);
    });
});
