var gulp = require('gulp'),
	jsx = require('gulp-jsx'),
	rename = require('gulp-rename'),
	react = require('gulp-react');

gulp.task('jsx', function() {
	return gulp.src('./public/scripts/chartbox.jsx')
		.pipe(react())
		.pipe(rename('chartbox.js'))
		.pipe(gulp.dest('public/scripts/'));
});