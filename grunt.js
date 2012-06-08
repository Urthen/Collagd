// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
//
module.exports = function(grunt) {

  grunt.initConfig({

    // The clean task ensures all files are removed from the dist/ directory so
    // that no files linger from previous builds.
    clean: ["client/dist/"],

    // The lint task will run the build configuration and the application
    // JavaScript through JSHint and report any errors.  You can change the
    // options for this task, by reading this:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md
    lint: {
      client: [
        "client/source/app/**/*.js"
      ], 
      server: [
        "app.js", "app/**/*.js"
      ]
    },

    // The jshint option for scripturl is set to lax, because the anchor
    // override inside main.js needs to test for them so as to not accidentally
    // route.
    jshint: {
      options: {
        scripturl: true
      },
      server: {
        options: {node: true, es5: true}  
      }
    },

    // This task uses the MinCSS Node.js project to take all your CSS files in
    // order and concatenate them into a single CSS file named index.css.  It
    // also minifies all the CSS as well.  This is named index.css, because we
    // only want to load one stylesheet in index.html.
    mincss: {
      "client/assets/css/index.min.css": [
        "client/assets/css/style.css"
      ]
    },

  });

  // The default task will remove all contents inside the dist/ folder, lint
  // all your code, precompile all the underscore templates into
  // dist/debug/templates.js, compile all the application code into
  // dist/debug/require.js, and then concatenate the require/define shim
  // almond.js and dist/debug/templates.js into the require.js file.
  grunt.registerTask("default", "clean lint");

  // The debug task is simply an alias to default to remain consistent with
  // debug/release.
  grunt.registerTask("debug", "default");

  // The release task will run the debug tasks and then minify the
  // dist/debug/require.js file and CSS files.
  grunt.registerTask("release", "default mincss");

};
