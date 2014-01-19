module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        coffee: {
            compile: {
                options: { 
                    join: false
                },
                files: {
                    'pushmenu.js': 'src/scripts/**/*.coffee'
                }
            }
        },
        recess: {
            dist: {
                options: {
                    compile: true
                },
                files: {
                    "pushmenu.css": ["src/styles/pushmenu.less"]
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-recess');
    grunt.registerTask('default', ['coffee', 'recess']);
};
