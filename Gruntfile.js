module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        coffee: {
            compile: {
                options: { 
                    join: false
                },
                files: {
                    'pushmenu.js': 'src/scripts/**/*.coffee',
                    'demo/demo.js': 'demo/demo.coffee'
                }
            }
        },
        recess: {
            dist: {
                options: {
                    compile: true
                },
                files: {
                    "pushmenu.css": ["src/styles/pushmenu.less"],
                    "demo/site.css": ["demo/site.less"]
                }
            }
        },
        copy: {
            demo: {
                files: [
                    { expand: true, flatten: true, src: ['src/partials/**'], dest: 'demo/partials', filter: 'isFile' }
                ]
            }
        }
    });
   
    grunt.loadNpmTasks('grunt-contrib-copy'); 
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-recess');
    grunt.registerTask('default', ['coffee', 'recess', 'copy']);
};
