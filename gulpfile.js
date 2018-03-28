// Load plugins
var gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    cssnano = require("gulp-cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    browserSync = require("browser-sync").create(),
    del = require("del"),
    gulpif = require("gulp-if"),
    htmlmin = require("gulp-htmlmin"),
    md5 = require("gulp-md5-plus"),
    sequence = require("gulp-sequence"),
    minimist = require("minimist"),
    browserify = require("browserify"),
    babelify = require("babelify"),
    uglify = require("gulp-uglify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer");

var knownOptions = {
    string: "env",
    default: {
        env: process.env.NODE_ENV || "development"
    }
};
var options = minimist(process.argv.slice(2), knownOptions);

const config = {
    styles: {
        src: "src/scss/*.scss",
        dest: "dist/styles",
        watch: "src/scss/**/*.scss",
        sourcemap: options.env !== "production",
        concat: {
            enabled: false,
            fileName: "styles.css"
        },
        minify: {
            enabled: true || options.env === "production",
            suffix: ".min"
        },
        md5: {
            enabled: options.env === "production",
            html: "./dist/**/*.html"
        }
    },
    scripts: {
        src: "src/scripts/**/*.js",
        dest: "dist/scripts",
        watch: "src/scripts/**/*.js",
        compile: true,
        sourcemap: options.env !== "production",
        concat: {
            enabled: true,
            fileName: "bundle.js"
        },
        minify: {
            enabled: true || options.env === "production",
            suffix: ".min"
        },
        md5: {
            enabled: options.env === "production",
            html: "./dist/**/*.html"
        },
        browserify: {
            entries: "src/scripts/entry.js",
            debug: options.env !== "production",
            transform: [
                [babelify, {
                    "presets": ["env"]
                }]
            ]
        }
    },
    html: {
        src: ["index.html", "views/**/*.html"],
        dest: "dist/",
        watch: ["index.html", "views/**/*.html"],
        minify: true,
        htmlMinOptions: {
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true,
            minifyCSS: true
        }
    },
    static: {
        src: "static/**/",
        dest: "dist/static",
        watch: "static/"
    },
    chore: {
        src: ["README.md", "_config.yml","LICENSE"],
        dest: "dist/"
    },
    clean: {
        path: "dist/"
    },
    server: {
        baseDir: "./dist",
        host: "0.0.0.0"
    },
    task: {
        default: "default",
        watch: "watch",
        server: "server",
        html: "html",
        styles: "styles",
        scripts: "scripts",
        static: "static",
        chore: "chore",
        clean: "clean"
    }
};

// Watch
gulp.task(config.task.watch, [config.task.default, config.task.server], function () {
    gulp.watch(config.html.watch, [config.task.html]).on("change", browserSync.reload);
    gulp.watch(config.styles.watch, [config.task.styles]);
    gulp.watch(config.scripts.watch, [config.task.scripts]);
});

// Default
gulp.task(config.task.default, sequence(config.task.clean, [config.task.html, config.task.static, config.task.chore], [config.task.styles, config.task.scripts]));

// Server
gulp.task(config.task.server, function () {
    browserSync.init({
        server: {
            baseDir: config.server.baseDir
        },
        host: config.server.host
    });
});

// Chore
gulp.task(config.task.chore, function () {
    return gulp.src(config.chore.src)
        .pipe(gulp.dest(config.chore.dest))
        .pipe(gulpif(options.env !== "production", browserSync.stream()));
});

// Static
gulp.task(config.task.static, function () {
    return gulp.src(config.static.src)
        .pipe(gulp.dest(config.static.dest))
        .pipe(gulpif(options.env !== "production", browserSync.stream()));
});

// Html
gulp.task(config.task.html, function () {
    return gulp.src(config.html.src, {
        base: "."
    })
        .pipe(htmlmin(config.html.htmlMinOptions))
        .pipe(gulp.dest(config.html.dest))
        .pipe(gulpif(options.env !== "production", browserSync.stream()));
});

// Styles
gulp.task(config.task.styles, function () {
    return gulp.src(config.styles.src)
        .pipe(gulpif(config.styles.sourcemap, sourcemaps.init()))
        .pipe(sass().on("error", sass.logError))
        .on("error", sass.logError)
        .pipe(autoprefixer("last 2 version"))
        .pipe(gulpif(config.styles.concat.enabled, concat(config.styles.concat.fileName)))
        .pipe(gulpif(config.styles.minify.enabled, cssnano()))
        .pipe(gulpif(config.styles.minify.enabled, rename({
            suffix: config.styles.minify.suffix
        })))
        .pipe(gulpif(config.styles.sourcemap, sourcemaps.write(".")))
        .pipe(gulpif(config.styles.md5.enabled, md5(10, config.styles.md5.html)))
        .pipe(gulp.dest(config.styles.dest))
        .pipe(gulpif(options.env != "production", browserSync.stream()));
});

// Scripts
gulp.task(config.task.scripts, function () {
    return browserify(config.scripts.browserify)
        .bundle()
        .on("error", function (err) {
            console.error(err);
            if (options.env !== "production") {
                this.emit("end");
            }
        })
        .pipe(source("bundle.js"))
        .pipe(buffer())
        .pipe(gulpif(config.scripts.sourcemap, sourcemaps.init({
            loadMaps: true
        })))
        .pipe(gulpif(config.scripts.minify.enabled, uglify()))
        .pipe(gulpif(config.scripts.minify.enabled, rename({
            suffix: config.scripts.minify.suffix
        })))
        .pipe(gulpif(config.scripts.sourcemap, sourcemaps.write(".")))
        .pipe(gulpif(config.scripts.md5.enabled, md5(10, config.scripts.md5.html)))
        .pipe(gulp.dest(config.scripts.dest))
        .pipe(gulpif(options.env !== "production", browserSync.stream()));
});

// Clean
gulp.task(config.task.clean, function () {
    return del(config.clean.path);
});