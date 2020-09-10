// Common.js modules type
const {src, dest, watch, series, parallel} = require('gulp');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const webpicture = require('gulp-webp');
const uglify = require('gulp-uglify');
const terser = require('gulp-terser');
const svgstore = require('gulp-svgstore');
const del = require('del');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const babel = require('gulp-babel');

// Clean build directory
const clean = () => {
  return del('build');
};

// Styles optimizations
const styles = () => {
  return src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemap.write('.'))
    .pipe(dest('build/css'))
    .pipe(browserSync.stream());
};

// Copy files to project
const copy = () => {
  return src(['source/fonts/**/*.{woff2,woff,ttf}', 'source/js/**/*.min.js'], {base: 'source'})
    .pipe(dest('build'));
};

// Copy slick library to build directory
const slick = () => {
  return src(['source/slick/**/*'], {base: 'source'})
    .pipe(dest('build'));
};

// HTML optimizations
const html = () => {
  return src('source/*.html')
    .pipe(posthtml([include()]))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(dest('build'));
};

// Images optimizations
const images = () => {
  return src('source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      // imagemin.svgo()
    ]))
    .pipe(dest('build/img'));
};

// Create and copy WebP images to build directory
const webp = () => {
  return src('source/img/**/*.{png,jpg}')
    .pipe(webpicture({quality: 75}))
    .pipe(dest('build/img'));
};

// JavaScript optimizations
const scripts = () => {
  return src(['source/js/**/*.js', '!source/js/**/*.min.js'])
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(terser())
    .pipe(rename({suffix: '.min'}))
    .pipe(dest('build/js'));
};

// SVG spites to build directory
const sprites = () => {
  return src(['source/img/*-icon.svg'])
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename('sprite.svg'))
    .pipe(dest('build/img'));
};

// Reload server
const refresh = () => {
  browserSync.reload();
};

// Copy svg4everybody library
const svg4everybody = () => {
  return src('node_modules/svg4everybody/dist/svg4everybody.min.js')
  .pipe(dest('build/js'));
};

// Copy picturefill library
const picturefill = () => {
  return src('node_modules/picturefill/dist/picturefill.min.js')
  .pipe(dest('build/js'));
};

// Copy babel polyfill library
const polyfill = () => {
  return src('node_modules/babel-polyfill/dist/polyfill.min.js')
  .pipe(dest('build/js'));
};

// Server live reloading
const server = () => {
  browserSync.init({server: 'build'});
  watch('source/sass/**/*.{scss,sass}', styles);
  watch('source/*.html').on('change', series(html, refresh));
  watch('source/js/*.js').on('change', series(scripts, copy, refresh));
};

// Build project
const build = series(clean, parallel(styles, scripts, svg4everybody, picturefill, polyfill, copy, html, webp, images, sprites));

// Start server
const start = series(build, server);

exports.build = build;
exports.start = start;
