const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const typescript = require('gulp-typescript');
const uglify = require('gulp-uglify');
const del = require('del');

// / / / / / / / / /
//  Clean source
// / / / / / / / / /

function clean(){
     return del(['public/**', '!public'], {force:true});
}

// / / / / / / / / /
//     Markup
// / / / / / / / / /

function pug2html() {
	return gulp.src('dev/pug/pages/*.pug')
		.pipe(plumber())
		.pipe(
			pug({
				pretty: true
			})
		)
		.pipe(plumber.stop())
		.pipe(gulp.dest('public'));
}

// / / / / / / / / /
//     Styles
// / / / / / / / / /

function scss2scc() {
	return gulp.src('dev/static/styles/styles/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(plumber.stop())
		.pipe(gulp.dest('public/static/styles'));
}

function copyNormalizeCSS() {
	return gulp.src('dev/static/styles/normalize/*.css')
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(gulp.dest('public/static/styles'));
}

// / / / / / / / / /
//     Scripts
// / / / / / / / / /

function copyScripts() {
	return gulp.src('dev/static/scripts/*.js')
		.pipe(gulp.dest('public/static/scripts'));
}

function ts2js() {
	return gulp.src('dev/static/scripts/*.ts')
		.pipe(plumber())
		.pipe(typescript({
            noImplicitAny: true
		}))
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(gulp.dest('public/static/scripts'));
}

// / / / / / / / / /
//    Images
// / / / / / / / / /

function copyImages() {
	return gulp.src('dev/static/images/**/*.*')
		.pipe(gulp.dest('public/static/images/'));
}

// / / / / / / / / /
//    Auto-refresh
// / / / / / / / / /

function watch() {
	gulp.watch("dev/pug/**/*.pug", pug2html)
	gulp.watch("dev/static/styles/**/*.scss", scss2scc)
}

// / / / / / / / / /
//    Gulp build
// / / / / / / / / /

const devTasks = gulp.parallel(
	pug2html,
	copyNormalizeCSS,
	scss2scc,
	copyScripts,
	ts2js,
	copyImages,
)

exports.default = gulp.series(
	clean,
	devTasks,
	watch,
)