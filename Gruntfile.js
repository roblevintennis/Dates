module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			dist: {
				src: ["src/date-modes.js"],
				dest: "dist/date-modes.js"
			}
		},
		jshint: {
			files: ["src/date-modes.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},
		uglify: {
			my_target: {
				src: ["dist/date-modes.js"],
				dest: "dist/date-modes.min.js"
			}
		}
	});
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.registerTask("default", ["jshint", "concat", "uglify"]);
	// grunt.registerTask("travis", ["jshint"]);
};
