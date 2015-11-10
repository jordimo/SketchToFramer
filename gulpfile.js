var gulp = require('gulp'),
    argv = require("yargs").argv,
    debug = require('gulp-debug'),
    exec = require('gulp-exec');
    notify = require('gulp-notify')

var paths = {
  input : argv.input,
  output : argv.output
}

var notify_flag = argv.notify

gulp.task('default', function(){

  gulp.watch(paths.input)
    .on('change', convert)
})


function convert(e)
{
  var options = {
    output : paths.output,
    artboards : argv.artboards || '',
    skipSvgExport : argv.skipSvgExport || false
  }
  var reportOptions = {
    err: true, // default = true, false means don't write err
    stderr: true, // default = true, false means don't write stderr
    stdout: true // default = true, false means don't write stdout
  }

  if (notify_flag)
  {
    return gulp
          .src(e.path)
          .pipe(exec('node s2f --input=<%= file.path %> --output=<%= options.output %> --artboards=<%= options.artboards %> --skipSvgExport=<%= options.skipSvgExport %>', options))
          .pipe(notify({ title: "Completed <%= file.relative %>", message : "SHABUM!"}))
  } else {
    return gulp
          .src(e.path)
          .pipe(exec('node s2f --input=<%= file.path %> --output=<%= options.output %> --artboards=<%= options.artboards %> --skipSvgExport=<%= options.skipSvgExport %>', options))
  }
}
