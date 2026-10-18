'use strict';
const fs = require('fs');
const upath = require('upath');
const pug = require('pug');
const sh = require('shelljs');
const prettier = require('prettier');
const crypto = require('crypto');

// Changes whenever any SCSS/JS source changes, so browsers re-fetch styles.css and scripts.js
// instead of serving a stale cached copy against new HTML.
function assetVersion() {
    const hash = crypto.createHash('sha1');
    const srcPath = upath.resolve(upath.dirname(__filename), '../src');
    sh.find(upath.join(srcPath, 'scss'), upath.join(srcPath, 'js'))
        .filter(f => /\.(scss|js)$/.test(f))
        .sort()
        .forEach(f => hash.update(f).update(fs.readFileSync(f)));
    return hash.digest('hex').slice(0, 10);
}

module.exports = function renderPug(filePath) {
    const destPath = filePath.replace(/src\/pug\//, 'dist/').replace(/\.pug$/, '.html');
    const srcPath = upath.resolve(upath.dirname(__filename), '../src');

    console.log(`### INFO: Rendering ${filePath} to ${destPath}`);
    const html = pug.renderFile(filePath, {
        doctype: 'html',
        filename: filePath,
        basedir: srcPath,
        assetVersion: assetVersion()
    });

    const destPathDirname = upath.dirname(destPath);
    if (!sh.test('-e', destPathDirname)) {
        sh.mkdir('-p', destPathDirname);
    }

    const prettified = prettier.format(html, {
        printWidth: 1000,
        tabWidth: 4,
        singleQuote: true,
        proseWrap: 'preserve',
        endOfLine: 'lf',
        parser: 'html',
        htmlWhitespaceSensitivity: 'ignore'
    });

    fs.writeFileSync(destPath, prettified);
};
