/**
* Copyright (c) 2016 Genuitec, LLC.  All rights reserved.
* 
* This Software, including any Licensed Content, is protected by copyright under
* United States, foreign laws and international treaties. Unauthorized use of
* this Software or Licensed Content may violate copyright, trademark and other
* laws.  Please refer to the "CoderLife Mobile App End User License Agreement"
* for more details on the rights and limitations for this Software.
*/

var gulp = require('gulp');
var gutil = require('gulp-util');

var replace = require('gulp-replace');
var replaceFiles = './www/js/app.js';
var conf = require('./conf.js');


gulp.task('set-values', function() {
  var path = require('path');
  return gulp.src(['./www/js/app.js'])
    .pipe(replace('{$SENDER_ID}', conf.senderId))
    .pipe(replace('{$BASE_URL}', conf.baseURL))
    .pipe(replace('{$PARSE_APP_ID}', conf.parse.applicationId))
    .pipe(replace('{$PARSE_REST_API_KEY}', conf.parse.restAPIKey))
    .pipe(replace('{$PUSH_NOTIFICATION_CHANNELS}', conf.pushNotificationChannels.join(',')))
    .pipe(gulp.dest( './www/js/' ));
});

gulp.task('unset-values', function() {
  gulp.src(['./www/js/app.js'])
    .pipe(replace(conf.senderId, '{$SENDER_ID}'))
    .pipe(replace(conf.baseURL, '{$BASE_URL}'))
    .pipe(replace(conf.parse.applicationId, '{$PARSE_APP_ID}'))
    .pipe(replace(conf.parse.restAPIKey, '{$PARSE_REST_API_KEY}'))
    .pipe(replace(conf.pushNotificationChannels.join(','), '{$PUSH_NOTIFICATION_CHANNELS}'))
    .pipe(gulp.dest('./www/js/'));
});
