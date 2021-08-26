const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync');
const { src, dest, task, watch, parallel, series } = require('gulp');
const useref = require('gulp-useref');
const autoPrefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const gulpIf = require('gulp-if');
const cache  = require('gulp-cache');
const {gifsicle, mozjpeg, optipng, svgo} = require('gulp-imagemin');
const imagemin = require('gulp-imagemin');
const del = require('del');
//Path
const options = {
	pug: {
		src: 'src/views/*.pug',
		all: 'src/views/**/*.pug',
		dest: 'src'
	},
	style: {
		src: 'src/styles/*.scss',
		all: 'src/styles/**/*.scss',
		dest: 'dist/styles',
	},
	html: {
		src: 'src/*.html',		
		dest: 'dist',
	},
	image: {
		src: 'src/images/*.+(png|jpg|jpeg|svg|gif)',
		dest: 'dist/images'
	},
	script: {
		all: 'src/scripts/**/*.js'
	},
	browserSync: {
		baseDir: 'dist'
	}
}
//OUTPUT: html files
task('pug', function(){
	return src(options.pug.src)
		.pipe(pug(
			{pretty: true}
		))
		.pipe(dest(options.pug.dest))		
})

//OUTPUT: css files
task('scss', function(){
	return src(options.style.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoPrefixer({
			cascade: false,
			grid: true
		}))
		.pipe(cssnano())
		.pipe(dest(options.style.dest))
		.pipe(browserSync.reload(
			{ stream: true }
		))
})

//OUTPUT: html files in dist and concatenated script files 
task('html', function(){
	return src(options.html.src)
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(dest(options.html.dest))
		.pipe(browserSync.reload(
			{ stream: true }
		))
})

//OUTPUT: image files in dist
task('image', function(){
	return src(options.image.src)
			.pipe(cache(imagemin([
				gifsicle({interlaced: true}),
				mozjpeg({quality: 75, progressive: true}),
				optipng({optimizationLevel: 5}),
				svgo({
					plugins: [
						{removeViewBox: true},
						{cleanupIDs: false}
					]
				})	
			], {
				verbose: true
			})
		))
		.pipe(dest(options.image.dest));
})

//Clear cache
task('clearCache',async function(){
	cache.clearAll();
})

//Init local server
function initServer() {
	browserSync.init({
		server: {
			baseDir: options.browserSync.baseDir
		},
		port: 3000
	});
}

//Hot reloading
function watchFiles() {
	watch(options.pug.all, series('pug'));
	watch(options.style.all, series('scss'));
	watch([options.html.src, options.script.all], series('html'));	
}

//Clean dist
task('cleanDist',async function(){
	return del.sync(['dist', 'src/*.html'])
})

task('build', series(parallel('cleanDist','pug'), parallel('scss','html','image')))
exports.run = series('build', parallel(initServer, watchFiles));
