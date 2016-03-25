var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var jade = require('metalsmith-jade');
var collections = require('metalsmith-collections');

Metalsmith(__dirname)
    .use(collections({
        posts: {
            pattern: 'data/entries/post/**/*.md'
        },
        authors: {
            pattern: 'data/entries/author/**/*.md'
        }
    }))
    .use(jade({
        pretty: true,
        useMetadata: true
    }))
    .use(markdown({}))
    .use(layouts({
        engine: 'jade',
        default: 'default.jade'
    }))
    .build(function (err) {
        if (err) throw err;

        console.log('Build finished!');
    });
