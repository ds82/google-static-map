# google-static-map [![Build Status](https://secure.travis-ci.org/ds82/google-static-map.svg)](http://travis-ci.org/ds82/google-static-map)

[![npm](https://nodei.co/npm/google-static-map.png?downloads=true&stars=true)](https://nodei.co/npm/google-static-map/)

[googlemaps]: https://github.com/moshen/node-googlemaps

The simplest way to generate static google-maps images from a location.
This package is just a thin wrapper around [googlemaps][] which does the real work ;)

## install
```
npm install google-static-map
```

## usage

### simple

```javascript
var fs = require('fs');
var gm = require('google-static-map').set('google-console-api-key');

var stream = gm().address('Apple Store, 5th Avenue, New York').staticMap().done();
stream.pipe(fs.createWriteStream('test.png'));
```

### advanced
```javascript
var fs = require('fs');
var gm = require('google-static-map').set('google-console-api-key');

var stream = gm()
  .zoom( 5 )
  .resolution( '600x600' )
  .maptype( 'roadmap' )
  .address('Apple Store, 5th Avenue, New York')
  .staticMap()
  .done();

stream.pipe(fs.createWriteStream('test.png'));
```

### with gulp (and json config file)

```
var source   = require('vinyl-source-stream');
var gm       = require('google-static-map');
var jsonedit = require('gulp-json-editor');


gulp.task('google-static-maps', function() {
  return gulp.src('config.json')
    .pipe(jsonedit(function( json ) {
      list.forEach(function( entry ) {
        gm()
          .address( entry.address )
          .staticMap()
          .done()
          .pipe( source( entry.filename ))
          .pipe( gulp.dest( entry.path ));
      });
      return json;
    }));
});
```


## tests
```
npm test
```

## license

MIT
