import gulp from 'gulp'
import gutil from 'gulp-util'

import cleanCSS from 'gulp-clean-css';
import imagemin from 'gulp-imagemin';
import del from 'del';

import sass from 'gulp-sass';

import webpack from 'webpack'

import nodemon from 'gulp-nodemon';

import browserSync from 'browser-sync';


const CLIENT = {
    SRC: 'client',
    DEST: 'build/client'
};
const SERVER = {
    SRC: 'server',
    DEST: 'build/server'
};

gulp.task('clean', () => {
    return del.sync([CLIENT.DEST, SERVER.DEST]);
});

gulp.task('copy', () => {
    const vendors = {
        'phaser': 'node_modules/phaser-ce/build/*.min.js',
        'socket.io': 'node_modules/socket.io-client/dist/*.slim.js'
    };

    for (let name in vendors) {
        gulp.src(vendors[name])
            .pipe(gulp.dest('build/client/vendor/' + name));
    }
});

gulp.task('webpack-server', (callback) => {
    webpack(require('./webpack.server.config.js'), (err, stats) => {
        if (err) throw new gutil.PluginError('webpack', err);
        callback();
    });
});

gulp.task('webpack-client', (callback) => {
    webpack(require('./webpack.client.config.js'), (err, stats) => {
        if (err) throw new gutil.PluginError('webpack', err);
        callback();
    });
});

gulp.task('sass', () => {
    return gulp.src(CLIENT.SRC + '/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(CLIENT.DEST));
});

gulp.task('images', () => {
    return gulp.src(CLIENT.SRC + '/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(CLIENT.DEST + '/images'));
});

gulp.task('build', ['clean', 'copy', 'webpack-server', 'webpack-client', 'sass', 'images'], () => {});

gulp.task('watch', ['build'], () => {
    let watcher = {
        client: gulp.watch(CLIENT.SRC + '/js/**/*.js', ['webpack-client']),
        server: gulp.watch(SERVER.SRC + '/**/*.js', ['webpack-server']),
        sass: gulp.watch(CLIENT.SRC + '/sass/**/*.scss', ['sass']),
        html: gulp.watch(CLIENT.SRC + '/*.html', ['webpack-client']),
        images: gulp.watch(CLIENT.SRC + '/images/*', ['images'])
    };

    let notify = (event) => {
        gutil.log('File', gutil.colors.yellow(event.path), 'was', gutil.colors.magenta(event.type));
    };

    for (let key in watcher) {
        watcher[key].on('change', notify);
    }

    gutil.log('Waiting for file changes...');
});

gulp.task('start-servers', ['watch'], () => {
    return nodemon({
        script: SERVER.DEST + '/main.js',
        watch: SERVER.DEST
    });
});

gulp.task('browser-sync', ['start-servers'], () => {
    browserSync.init(null, {
        proxy: 'http://localhost:8080',
        files: ['build/client/**/*.*'],
        port: 7000,
        browser: 'google chrome'
    });
});

gulp.task('default', ['browser-sync'], () => {
    gutil.log('Web server and game server is running.');
});