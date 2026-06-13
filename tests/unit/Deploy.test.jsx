import fs from 'fs';
import path from 'path';

describe('Deployable Status Tests', () => {
    it('should have a build script in package.json', () => {
        const pkgJsonPath = path.resolve(__dirname, '../../package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        expect(pkgJson.scripts).toHaveProperty('build');
        expect(pkgJson.scripts.build).toBe('vite build');
    });

    it('should have a dev script in package.json', () => {
        const pkgJsonPath = path.resolve(__dirname, '../../package.json');
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        expect(pkgJson.scripts).toHaveProperty('dev');
    });

    it('should have a vite config file for deployment', () => {
        const viteConfigPath = path.resolve(__dirname, '../../vite.config.js');
        const exists = fs.existsSync(viteConfigPath);
        expect(exists).toBe(true);
    });

    it('should have an index.html entry point', () => {
        const indexPath = path.resolve(__dirname, '../../index.html');
        const exists = fs.existsSync(indexPath);
        expect(exists).toBe(true);
    });
});
