"use strict";
var gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    cssnano = require("gulp-cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    browsersync = require("browser-sync").create(),
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
    buffer = require("vinyl-buffer"),
    tsify = require("tsify"),
    es = require("event-stream"),
    header = require("gulp-header"),
    clone = require("gulp-clone"),
    release = require("gulp-github-release"),
    npmpkg = require("./package.json"),
    extend = require("util")._extend;

const knownOptions = {
    string: ["env", "prerelease", "githubtoken"],
    default: {
        env: process.env.NODE_ENV || "development",
        prerelease: "",
        githubtoken: ""
    }
};

const options = minimist(process.argv.slice(2), knownOptions);

const config = {
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
        },
        srcOptions: {
            base: "."
        }
    },
    styles: {
        src: "scss/*.scss",
        dest: "dist/styles",
        watch: "scss/**/*.scss",
        sourcemap: options.env !== "production",
        concat: {
            enabled: false,
            fileName: "styles.css"
        },
        minify: {
            enabled: true || options.env === "production",
        },
        suffix: {
            enabled: true,
            text: ".min"
        },
        md5: {
            enabled: options.env === "production",
            html: "./dist/**/*.html"
        }
    },
    gallery: {
        dest: "dist/scripts",
        watch: ["src/**/*.js", "src/**/*.ts"],
        sourcemap: options.env !== "production",
        bundle: "bundle.js",
        minify: {
            enabled: false || options.env === "production",
        },
        suffix: {
            enabled: true,
            text: ".min"
        },
        md5: {
            enabled: options.env === "production",
            html: "./dist/**/*.html"
        },
        browserify: {
            entries: "src/GalleryEntry.ts",
            debug: options.env !== "production",
            transform: [
                [babelify, {
                    "presets": ["env"]
                }]
            ]
        }
    },
    static: {
        src: "static/**/",
        dest: "dist/static",
        watch: "static/**/*.json"
    },
    chore: {
        src: ["README.md", "_config.yml", "LICENSE", "CNAME"],
        dest: "dist/"
    },
    clean: {
        path: "dist/"
    },
    release: {
        dest: "release/",
        suffix: ".min",
        bundle: "general-engine.core.js",
        bundle_minfify: "general-engine.core.min.js",
        browserify: {
            entries: "src/Core/_Entry.ts",
            standalone: "General",
            transform: [
                [babelify, {
                    "presets": ["env"]
                }]
            ]
        },
        github: {
            src: [
                "CHANGELOG.md",
                "LICENSE",
                "release/general-engine.core.js",
                "release/general-engine.core.min.js"
            ]
        }
    },
    npm: {
        dest: "lib/",
        suffix: ".min",
        bundle: "index.js",
        browserify: {
            entries: "src/Core/GeneralNode.ts",
            standalone: "General",
            transform: [
                [babelify, {
                    "presets": ["env"]
                }]
            ]
        }
    },
    server: {
        baseDir: "./dist",
        host: "0.0.0.0",
        index: "README.md"
    },
    task: {
        default: "default",
        watch: "watch",
        server: "server",
        html: "html",
        styles: "styles",

        static: "static",
        chore: "chore",
        clean: "clean",

        scripts: {
            gallery: "scripts:gallery",
            npm: "scripts:npm",
            release: "scripts:release"
        },
        release: {
            github: "release:github"
        },
        quick: {
            release: "quick:release"
        }
    }
};

const banner = [
    "/**",
    "* <%= context.name %> <%= context.version %> by <%= context.author %> <%= extra.date %>",
    "* <%= context.homepage %>",
    "* License <%= context.license %>",
    "*/",
    ""
].join("\n");

// Watch
gulp.task(config.task.watch, [config.task.default, config.task.server], function () {
    gulp.watch(config.html.watch, [config.task.html]).on("change", browsersync.reload);
    gulp.watch(config.styles.watch, [config.task.styles]);
    gulp.watch(config.static.watch, [config.task.static]);
    gulp.watch(config.gallery.watch, [config.task.scripts.gallery]);
});

// Default
gulp.task(config.task.default, sequence(config.task.clean, [config.task.html, config.task.static, config.task.chore], [config.task.styles, config.task.scripts.gallery]));

// Server
gulp.task(config.task.server, function () {
    browsersync.init({
        server: {
            baseDir: config.server.baseDir,
            index: config.server.index
        },
        host: config.server.host
    });
});

// Clean
gulp.task(config.task.clean, function () {
    return del(config.clean.path);
});

// Chore
gulp.task(config.task.chore, function () {
    return gulp.src(config.chore.src)
        .pipe(gulp.dest(config.chore.dest))
        .pipe(gulpif(options.env !== "production", browsersync.stream()));
});

// Static
gulp.task(config.task.static, function () {
    return gulp.src(config.static.src)
        .pipe(gulp.dest(config.static.dest))
        .pipe(gulpif(options.env !== "production", browsersync.stream()));
});

// Html
gulp.task(config.task.html, function () {
    return gulp.src(config.html.src, config.html.srcOptions)
        .pipe(htmlmin(config.html.htmlMinOptions))
        .pipe(gulp.dest(config.html.dest))
        .pipe(gulpif(options.env !== "production", browsersync.stream()));
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
        .pipe(gulpif(config.styles.suffix.enabled, rename({
            suffix: config.styles.suffix.text
        })))
        .pipe(gulpif(config.styles.sourcemap, sourcemaps.write(".")))
        .pipe(gulpif(config.styles.md5.enabled, md5(10, config.styles.md5.html)))
        .pipe(gulp.dest(config.styles.dest))
        .pipe(gulpif(options.env != "production", browsersync.stream()));
});

// Scripts: Gallery
gulp.task(config.task.scripts.gallery, function () {
    return buildGalleryScripts(compile(config.gallery), config.gallery)
        .pipe(gulpif(options.env !== "production", browsersync.stream()));
});

// Scripts: NPM
gulp.task(config.task.scripts.npm, function () {
    return buildNPMScripts(compile(config.npm), config.npm);
});

// Scripts: Release
gulp.task(config.task.scripts.release, function () {
    return buildReleaseScripts(compile(config.release), config.release, extendPackageInfo(npmpkg));
});

// Release: GitHub    
// Commandline: gulp release:github --prerelease alpha1.0 --githubtoken <token>
gulp.task(config.task.release.github, function () {
    return releaseToGitHub(extendPackageInfo(npmpkg));
});

// Compile and release to GitHub    
// Commandline: gulp quick:release --prerelease alpha1.0 --githubtoken <token>
gulp.task(config.task.quick.release, sequence(config.task.scripts.release, config.task.release.github));


function extendPackageInfo(args) {
    let isPrerelease = options.prerelease !== "";
    let pkgInfo = extend(extend({}, args), {
        version: "v" + args.version + (isPrerelease ? "-" + options.prerelease : ""),
        prerelease: isPrerelease
    });
    return pkgInfo;
}

function compile(args) {
    return browserify(args.browserify)
        .plugin(tsify)
        .bundle()
        .on("error", function (err) {
            // eslint-disable-next-line
            console.error(err);
            if (options.env !== "production") {
                this.emit("end");
            }
        })
        .pipe(source(args.bundle))
        .pipe(buffer());
}

function buildNPMScripts(stream, args) {
    return stream.pipe(gulp.dest(args.dest));
}

function buildReleaseScripts(stream, args, packageInfo) {
    let script_normal = stream
        .pipe(clone())
        .pipe(header(banner, {
            context: packageInfo,
            extra: {
                date: new Date().toISOString().slice(0, 10)
            }
        }))
        .pipe(gulp.dest(args.dest));
    let script_minify = stream
        .pipe(clone())
        .pipe(uglify())
        .pipe(header(banner, {
            context: packageInfo,
            extra: {
                date: new Date().toISOString().slice(0, 10)
            }
        }))
        .pipe(rename({
            suffix: args.suffix
        })).pipe(gulp.dest(args.dest));

    return es.merge(script_normal, script_minify);
}

function buildGalleryScripts(stream, args) {
    return stream
        .pipe(gulpif(args.sourcemap, sourcemaps.init({
            loadMaps: true
        })))
        .pipe(gulpif(args.minify.enabled, uglify()))
        .pipe(gulpif(args.suffix.enabled, rename({
            suffix: args.suffix.text
        })))
        .pipe(gulpif(args.sourcemap, sourcemaps.write(".")))
        .pipe(gulpif(args.md5.enabled, md5(10, args.md5.html)))
        .pipe(gulp.dest(args.dest));
}

function releaseToGitHub(packageInfo) {
    return gulp.src(config.release.github.src)
        .pipe(release({
            token: options.githubtoken,
            owner: packageInfo.author,
            repo: packageInfo.name,
            tag: packageInfo.version,
            name: packageInfo.name + " " + packageInfo.version,
            draft: true,
            prerelease: options.prerelease
        }));
}