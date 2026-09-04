describe('test environment setup', () => {
    it('loads environment variables from .env.test', () => {
        expect(process.env.DATABASE_URL).toContain('url_shortener_test');
    });
});
