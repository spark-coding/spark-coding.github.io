'use strict';
const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');

module.exports = function renderAssets() {
    const sourcePath = upath.resolve(upath.dirname(__filename), '../src/assets');
    const destPath = upath.resolve(upath.dirname(__filename), '../dist/.');
    
    sh.cp('-R', sourcePath, destPath)

    // Files served from the site root (e.g. /guide.pdf) live in src/static.
    const staticPath = upath.resolve(upath.dirname(__filename), '../src/static');
    if (fs.existsSync(staticPath)) {
        sh.cp('-R', `${staticPath}/*`, destPath);
    }
};