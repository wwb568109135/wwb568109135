var gulp = require('gulp'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev'),
    clean = require('gulp-clean'),
    revCollector = require('gulp-rev-collector'),
    rename = require("gulp-rename");

gulp.task('clean-css', function() {
    return gulp.src(['./src/css/min/'], {
            read: false
        })
        .pipe(clean());
});

gulp.task('clean-js', function() {
    return gulp.src(['./src/demo/js/min/'], {
            read: false
        })
        .pipe(clean());
});

gulp.task('clean-html', function() {
    return gulp.src(['./src/demo/pingou.html'], {
            read: false
        })
        .pipe(clean());
});

gulp.task('css', ['clean-css'], function() { //- 创建一个名为 concat 的 task
    return gulp.src(['./src/css/reset.css', './src/css/brand.css']) //- 需要处理的css文件，放到一个字符串数组里
        .pipe(concat('mst.css'))
        .pipe(minifyCss()) //- 压缩处理成一行
        .pipe(gulp.dest('./src/css')) //- 输出文件本地
        .pipe(rev()) //- 文件名加MD5后缀
        .pipe(gulp.dest('./src/css/min')) //- 输出文件本地
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./src/rev/css'))
});

gulp.task('js', ['clean-js'], function() {
    var bower = gulp.src(['./src/bower_component/jquery/dist/jquery.js', './src/bower_component/jquery-tmpl/jquery.tmpl.js'])
        .pipe(concat('jquery.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./src/demo/js/'))
        .pipe(rev())
        .pipe(gulp.dest('./src/demo/js/min'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./src/rev/bower'))

    var all = gulp.src(['./src/demo/js/base.js', './src/demo/js/jquery.lazyload.js'])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./src/demo/js/'))
        .pipe(rev())
        .pipe(gulp.dest('./src/demo/js/min'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./src/rev/js'))

    return bower && all;
});

gulp.task('rev', ['clean-html','css', 'js'], function() {
    return gulp.src(['./src/rev/**/*.json', './src/demo/pingou_default.html']) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css': 'css/min',
                'js': 'js/min'
            }
        }))
        .pipe(rename('pingou.html'))
        .pipe(gulp.dest('./src/demo/'));
});

gulp.task('default', ['rev']);

gulp.task('watch', function() {
    // 监听所有.scss档
    gulp.watch(['./src/css/reset.css', './src/css/brand.css','./src/demo/js/base.js', './src/demo/js/jquery.lazyload.js'], ['default']);
});
