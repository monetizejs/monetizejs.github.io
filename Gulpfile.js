var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var spawn = require('child_process').spawn;

var monetizeJsPublicFolder = '../../dock5/public/';


gulp.task('clean-assets', function() {
	return gulp.src('./assets/*')
		.pipe(plugins.rimraf());
});

gulp.task('copy-assets', ['clean-assets'], function() {
	return gulp.src(monetizeJsPublicFolder+ 'app-min/assets/*.*')
		.pipe(gulp.dest('./assets/'));
});

gulp.task('clean-css', function() {
	return gulp.src('./css/*')
		.pipe(plugins.rimraf());
});

gulp.task('copy-css', ['clean-css'], function() {
	return gulp.src(monetizeJsPublicFolder+ 'app-min/*.css')
		.pipe(gulp.dest('./css/'));
});

gulp.task('build-head', ['copy-assets', 'copy-css'], function() {
	return gulp.src('./_includes/head.html')
		.pipe(plugins.inject(
			gulp.src('./css/main-*', { read: false }),
			{ starttag: '<!-- inject:app-style:{{ext}} -->' }))
		.pipe(plugins.inject(
			gulp.src('./assets/icon-*', { read: false }),
			{
				starttag: '<!-- inject:app-icon -->',
				transform: function(filepath) {
					return '<link rel="icon" href="' + filepath + '" type="image/x-icon">';
				}
			}))
		.pipe(plugins.inject(
			gulp.src('./assets/logo-*', { read: false }),
			{
				starttag: '<!-- inject:logo -->',
				transform: function(filepath) {
					return '<img class="logo" src="' + filepath + '" width="210">';
				}
			}))
		.pipe(gulp.dest('./_includes/'));

});

gulp.task('default', ['build-head']);

gulp.task('run', ['default'], function() {
	var server = spawn('jekyll', ['serve']);
	server.stdout.on('data', function (data) {
		process.stdout.write('' + data);
	});
	server.stderr.on('data', function (data) {
		process.stderr.write('' + data);
	});
	server.on('error', function (data) {
		console.log('error: ' + data);
	});
	server.on('close', function (code) {
		console.log('child process exited with code ' + code);
	});
});
