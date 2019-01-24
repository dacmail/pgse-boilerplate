var gulp = require("gulp"),
  rename = require("gulp-rename"),
  argv = require("yargs").argv,
  gulpif = require("gulp-if"),
  log = require("fancy-log"),
  cached = require("gulp-cached"),
  stripDebug = require("gulp-strip-debug"),
  sourcemaps = require("gulp-sourcemaps"),
  php2html = require("gulp-php2html"),
  htmlmin = require("gulp-htmlmin"),
  browserSync = require("browser-sync"),
  del = require("del"),
  sass = require("gulp-sass"),
  cleanCSS = require("gulp-clean-css"),
  autoprefixer = require("gulp-autoprefixer"),
  uglify = require("gulp-uglify"),
  include = require("gulp-include"),
  babel = require("gulp-babel"),
  gcmq = require('gulp-group-css-media-queries');

var folderScripts = "src/assets/scripts",
  folderStyles = "src/assets/styles",
  folderImages = "src/assets/images",
  folderFonts = "src/assets/fonts";

function bSync(done) {
  browserSync({
    server: {
      baseDir: "./dist/"
    },
    port: 8080,
    notify: false,
    open: true,
    ghostMode: true
  });

  gulp.watch([
    `${folderScripts}/**/*.js`,
    `!${folderScripts}/**/vendor.js`
  ], gulp.series(scripts));
  gulp.watch(folderScripts + "/**/vendor.js", gulp.series(vendor));
  gulp.watch(folderStyles + "/**/*.scss", gulp.parallel(scss));
  gulp.watch(folderImages + "/**/*", gulp.parallel(images));
  gulp.watch(folderFonts + "/**/**.{ttf,woff,eot,svg}", gulp.parallel(fonts));

  gulp.watch(["src/**/*.php"], gulp.parallel(genHTML));

  gulp
    .watch([
      "dist/index.html",
      "dist/**/*.js"
    ])
    .on("change", browserSync.reload);

  done();
}

function setWatch(cb) {
  global.isWatching = true;
  cb();
};

function clean() {
  return del(['dist']);
}

function runProd(cb) {
  argv.production = true;
  cb();
}

function runDev(cb) {
  argv.production = false;
  cb();
}

function genHTML() {
  return gulp
    .src([
      "src/templates/pages/*.php",
      "!src/**/_*.php"
    ])
    .pipe(php2html())
    .pipe(gulpif(argv.production, htmlmin({
      collapseWhitespace: true
    })))
    .on("error", console.error)
    .pipe(gulp.dest(`dist/`));
}

function scripts() {
  return gulp
    .src([
      "src/assets/scripts/main.js",
      "src/assets/scripts/modal.js",
    ], { allowEmpty: true })
    .pipe(gulpif(!argv.production, sourcemaps.init()))
    .pipe(include())
    .pipe(babel({
      presets: ["env"],
      compact: false
    }))
    .pipe(gulpif(argv.production, stripDebug()))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulpif(global.isWatching, cached('main')))
    .pipe(gulpif(!argv.production, sourcemaps.write('.')))
    .pipe(gulp.dest('dist/assets/scripts'));
}

function vendor() {
  return gulp.src(`src/assets/scripts/vendor.js`)
    .pipe(include())
    .pipe(gulpif(argv.production, uglify().on("error", log)))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest('dist/assets/scripts'));
}

function scss() {
  return gulp
    .src('src/assets/styles/main.scss', { allowEmpty: true })
    .pipe(gulpif(!argv.production, sourcemaps.init()))
    .pipe(sass
      .sync({
        outputStyle: "expanded",
        precision: 10,
        includePaths: ["."]
      })
      .on("error", sass.logError))
    .pipe(autoprefixer({
      browsers: ["> 1%", "last 2 versions", "Firefox ESR", "ie 9"]
    }))
    .pipe(gulpif(argv.production, cleanCSS({
      compatibility: "ie10"
    })))
    .pipe(gulpif(!argv.production, cleanCSS({
      compatibility: "ie10",
      advanced: false
    })))
    .pipe(gulpif(global.isWatching, cached('maincss')))
    .pipe(gulpif(!argv.production, sourcemaps.write('.')))
    .pipe(gulp.dest('dist/assets/styles'))
    .pipe(gulpif(!argv.production, browserSync.stream()));
}

function combineMQ() {
  return gulp
    .src([
      'dist/assets/styles/main.css',
      'dist/assets/styles/ie10.css'
    ], {
      allowEmpty: true
    })
    .pipe(gcmq())
    .pipe(cleanCSS({
      compatibility: "ie10"
    }))
    .pipe(gulp.dest('dist/assets/styles/'));
}

function images() {
  return gulp
      .src(folderImages + '/**/*')
      .pipe(gulp.dest('dist/assets/images'));
}

function fonts() {
  return gulp
    .src(folderFonts + '/**/*.{ttf,woff,eot,svg}')
    .pipe(gulp.dest('dist/assets/fonts'));
}

gulp.task(
  "start",
  gulp.series(
    clean,
    setWatch,
    runDev,
    vendor,
    scripts,
    scss,
    images,
    fonts,
    genHTML,
    bSync
  )
);

gulp.task(
  "build",
  gulp.series(
    clean,
    runProd,
    genHTML,
    vendor,
    scripts,
    scss,
    images,
    fonts,
    combineMQ
  )
);

