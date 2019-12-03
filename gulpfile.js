const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const gulpSass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');

const path = {
  src: {
    html: 'src/*.html',
    scss: 'src/scss/*.scss',
    js: 'src/js/*.js',
    css: 'src/css/',
    img: 'src/img/*'
  },
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/'
  }
};

// *******************DEV**************//
const sass = () => {
  return src(path.src.scss)
    .pipe(gulpSass())
    .pipe(
      autoprefixer({
        browsers: ['last 20 versions'],
        cascade: false
      })
    )
    .pipe(dest(path.src.css))
    .pipe(browserSync.stream());
};
//import bootstrap js and dependencies
const bootstrap = () => {
  return src([
    './node_modules/jquery/dist/jquery.js',
    './node_modules/popper.js/dist/popper.js',
    './node_modules/bootstrap/dist/js/bootstrap.js'
  ]).pipe(dest('./src/js'));
};
const launchBrowser = (path = './src/', port = 3000) => {
  browserSync.init({
    server: path,
    port
  });
};

const watchSass = () => watch([path.src.scss], sass);
const watchHtml = () => watch([path.src.html], browserSync.reload);
const watchJs = () => watch([path.src.js], browserSync.reload);
const watchImg = () => watch([path.src.img], browserSync.reload);

const serve = series(parallel(sass, bootstrap), function() {
  launchBrowser();
  watchSass();
  watchHtml();
  watchJs();
  watchImg();
});

exports.default = serve;

// *******************BUILD**************//
const htmlBuild = () => {
  return src(path.src.html).pipe(dest(path.build.html));
};
const jsBuild = () => {
  return src([path.src.js]).pipe(dest(path.build.js));
};
const cssBuild = () => {
  return src(path.src.css.concat('*.css')).pipe(dest(path.build.css));
};
const imgBuild = () => {
  return src(path.src.img)
    .pipe(imagemin())
    .pipe(dest(path.build.img));
};
const build = parallel(htmlBuild, jsBuild, cssBuild, imgBuild);
const serveBuild = series(build, () => launchBrowser('./prod/', 8000));
exports.build = build;
exports.serveBuild = serveBuild;
