var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var jade = require('metalsmith-jade');
var collections = require('metalsmith-collections');
var beautify = require('metalsmith-beautify');
var formatcheck = require('metalsmith-formatcheck');
var permalinks = require('metalsmith-permalinks');
var slug = require('metalsmith-slug');
var fileMetadata = require('metalsmith-filemetadata');

function slugLowerCase() {
    return function slugLowerCase(files, metalsmith, done){
        for (var file in files) {
            for(var prop in files[file]) {
                if(prop === 'slug') {
                    files[file][prop] = files[file][prop].toLowerCase();
                }
            }
        }
        done();
    };
}

Metalsmith(__dirname)
    .use(markdown({
        gfm: true,
        tables: false,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: false,
        smartypants: false
    }))
    .use(slug({
        property: 'title',
        patterns: ['data/entries/category/*.*']
    }))
    .use(slug({
        property: 'name',
        patterns: ['data/entries/author/*.*']
    }))
    .use(slugLowerCase())
    .use(collections({
        posts: {
            pattern: 'data/entries/post/*.*',
            sortBy: 'title',
            reverse: false
        },
        authors: {
            pattern: 'data/entries/author/*.*',
            sortBy: 'name',
            reverse: false
        },
        categories: {
            pattern: 'data/entries/category/*.*',
            sortBy: 'title',
            reverse: false
        }
    }))
    .use(fileMetadata([
        {
            pattern: 'data/entries/post/*.*',
            metadata: {
                layout: 'post.jade'
            }
        },
        {
            pattern: 'data/entries/author/*.*',
            metadata: {
                layout: 'author.jade'
            }
        },
        {
            pattern: 'data/entries/category/*.*',
            metadata: {
                layout: 'category.jade'
            }
        }
    ]))
    .use(jade({
        pretty: true,
        useMetadata: true
    }))
    .use(permalinks({
        relative: false,
        linksets: [
            {
                match: {collection: 'posts'},
                pattern: ':slug'
            },
            {
                match: {collection: 'authors'},
                pattern: 'authors/:slug'
            },
            {
                match: {collection: 'categories'},
                pattern: 'categories/:slug'
            }
        ]
    }))
    .use(layouts({
        engine: 'jade',
        pretty: true,
        default: 'default.jade',
        directory: './layouts',

    }))
    .use(beautify({
        css: false,
        js: false,
        html: {
            indent_size: 1,
            indent_char: ' ',
            indent_with_tabs: true,
            wrap_line_length: 0
        }
    }))
    //.use(formatcheck())
    .build(function (err) {
        if (err) {
            console.error(err);
            return;
        }

        console.log('Build finished!');
    });
