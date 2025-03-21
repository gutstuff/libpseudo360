const fs = require('fs');
const fsPromises = require('fs').promises;
const { join } = require('node:path');
const { task, series, src, dest } = require('gulp');
const terser = require('gulp-terser');
const rename = require("gulp-rename");

const DIST = 'dist/';
const DIST_JS = join(DIST, 'js');

async function clean() {
    try {
        await fsPromises.access(DIST,
            fs.constants.R_OK | fs.constants.W_OK);
        return fsPromises.rm(DIST, { recursive: true }, err => {
            if (err) {
                console.error(`Cannot delete '${DIST}' !`);
            }
        });
    } 
    catch {
        console.error(`Cannot access '${DIST}'`);
        return;
    }
}

task(clean);

function createDirectories() {
    return fsPromises.mkdir(DIST_JS, { recursive: true });
}

function copyFiles() {
    return src([
            '*img-ui/*',
            '*css/*',
        ], { removeBOM: false })
        .pipe(dest(DIST));
}

function minifyjs() {
    return src('js/*.js')
        .pipe(terser())
        .pipe(rename(path => {
            path.extname = '.min.js';
        }))
        .pipe(dest(DIST_JS));
}

task('minify', series(minifyjs));

exports.default = series(clean, createDirectories, copyFiles, minifyjs);
