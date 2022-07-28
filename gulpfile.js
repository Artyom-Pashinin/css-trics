const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const typescript = require('gulp-typescript');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

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

function jsLibs() {
	return gulp.src([
		// 'node_modules/svg4everybody/dist/svg4everybody.js',
		// 'node_modules/lodash.clonedeep/index.js'
	])
		.pipe(concat('libs.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/static/scripts/libs/'));
}

exports.default = gulp.series(
	pug2html,
	copyNormalizeCSS,
	scss2scc,
	copyScripts,
	ts2js,
	// jsLibs,
)