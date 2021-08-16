const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");

function style() {
  return src("./scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("./css"))
    .pipe(browserSync.stream());
}

function start() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  watch("./scss/**/*.scss", style);
  watch("./*.html").on("change", () => {
    return browserSync.reload();
  });
  watch("./js/main.js").on("change", () => {
    jsBundle();
    return browserSync.reload();
  });
}

function jsBundle() {
  return browserify({
    entries: ["./js/main.js"],
  })
    .transform(
      babelify.configure({
        presets: ["@babel/preset-env"],
      })
    )
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(dest("./js/"));
}

exports.dev = series(jsBundle, start);
