# BodyParser Open-Source Report

## What does BodyParser accomplish for us?

We use BodyParser when parsing the Content-Type application/json. BodyParser is a middleware for Express which we use to parse json body types


Body Parser "Parse{s} incoming request bodies in a middleware before your handlers, available under the req.body property."

## How does BodyParser accomplish what it does?

From the developer side, getting started with BodyParser is pretty simple

```javascript
var express = require('express') //Imports Express
var bodyParser = require('body-parser') // Imports BodyParser

var app = express(); //Initialize Express

app.use(bodyParser.json()); //app.use() accepts the BodyParser middleware to parse bodytypes of application/json

app.post('/login', function (req, res) {
  res.send('welcome, ' + req.body.username) //req.body is part of express that stores the body's contents.
})
```

## What's actually going on

* Inside Body-Parser's index.js class they define types for each of the different content types usable. For our cases this is the type json.
```javascript
Object.defineProperty(exports, 'json', {
  configurable: true,
  enumerable: true,
  get: createParserGetter('json')
})
```
* The option type of json above returns the result from createParserGetter('json')
```javascript
function createParserGetter (name) {
  return function get () {
    return loadParser(name)
  }
}
```
*LoadParser loads the file responsible for the content type chosen
```javascript
function loadParser (parserName) {
  var parser = parsers[parserName]

  if (parser !== undefined) {
    return parser
  }

  // this uses a switch for static require analysis
  switch (parserName) {
    case 'json':
      parser = require('./lib/types/json')
      break
    case 'raw':
      parser = require('./lib/types/raw')
      break
    case 'text':
      parser = require('./lib/types/text')
      break
    case 'urlencoded':
      parser = require('./lib/types/urlencoded')
      break
  }

  // store to prevent invoking require()
  return (parsers[parserName] = parser)
}
```
[Link to code][index]


* ### The BodyParser Function:
     This is the function that is getting called when we use bodyParser.json() in app.use(bodyParser.json()); The next part will be what exports.json(opts) is doing
```javascript
//Snipet from line 93
function bodyParser (options) {
  var opts = {}

  // exclude type option
  if (options) {
    for (var prop in options) {
      if (prop !== 'type') {
        opts[prop] = options[prop]
      }
    }
  }

  var _urlencoded = exports.urlencoded(opts)
  var _json = exports.json(opts)

  return function bodyParser (req, res, next) {
    _json(req, res, function (err) {
      if (err) return next(err)
      _urlencoded(req, res, next)
    })
  }
}
```
[Link to code][index]


* ### Inside the Json Parsing File
    The function below preps another function: Read with the function "parse" which determines how to parse the body of the request.
```javascript
function json (options) {
  var opts = options || {}



  // create the appropriate type checking function
  var shouldParse = typeof type !== 'function'
    ? typeChecker(type)
    : type

  function parse (body) {
    if (body.length === 0) {
      // special-case empty json body, as it's a common client-side mistake
      // TODO: maybe make this configurable or part of "strict" option
      return {}
    }


    try {
      debug('parse json')
      return JSON.parse(body, reviver)
    } catch (e) {
      throw normalizeJsonSyntaxError(e, {
        message: e.message,
        stack: e.stack
      })
    }
  }

  return function jsonParser (req, res, next) {
    if (req._body) {
      debug('body already parsed')
      next()
      return
    }

    req.body = req.body || {}

    // skip requests without bodies
    if (!typeis.hasBody(req)) {
      debug('skip empty body')
      next()
      return
    }

    // read
    read(req, res, next, parse, debug, {
      encoding: charset,
      inflate: inflate,
      limit: limit,
      verify: verify
    })
  }
}
```
[Link to code][json]  Some optional code is omitted to make reading easier

* ### Inside the Read Function
    Inside the Read command it basically gets the stream and applies the encoding requested in the contentstream method.
  Get Body it checks for an error first if true, then verifies the body if true, then it reads the body and uses different methods depending on if it is encoded or not.
```javascript
function read (req, res, next, parse, debug, options) {
  var length
  var opts = options
  var stream

  // flag as parsed
  req._body = true

  // read options
  var encoding = opts.encoding !== null
    ? opts.encoding
    : null
  var verify = opts.verify

  try {
    // get the content stream
    stream = contentstream(req, debug, opts.inflate)
    length = stream.length
    stream.length = undefined
  } catch (err) {
    return next(err)
  }

  // set raw-body options
  opts.length = length
  opts.encoding = verify
    ? null
    : encoding

  // assert charset is supported
  if (opts.encoding === null && encoding !== null && !iconv.encodingExists(encoding)) {
    return next(createError(415, 'unsupported charset "' + encoding.toUpperCase() + '"', {
      charset: encoding.toLowerCase(),
      type: 'charset.unsupported'
    }))
  }

  // read body
  debug('read body')
  getBody(stream, opts, function (error, body) {
    if (error) {
      var _error

      if (error.type === 'encoding.unsupported') {
        // echo back charset
        _error = createError(415, 'unsupported charset "' + encoding.toUpperCase() + '"', {
          charset: encoding.toLowerCase(),
          type: 'charset.unsupported'
        })
      } else {
        // set status code on error
        _error = createError(400, error)
      }

      // read off entire request
      stream.resume()
      onFinished(req, function onfinished () {
        next(createError(400, _error))
      })
      return
    }

    // verify
    if (verify) {
      try {
        debug('verify body')
        verify(req, res, body, encoding)
      } catch (err) {
        next(createError(403, err, {
          body: body,
          type: err.type || 'entity.verify.failed'
        }))
        return
      }
    }

    // parse
    var str = body
    try {
      debug('parse body')
      str = typeof body !== 'string' && encoding !== null
        ? iconv.decode(body, encoding)
        : body
      req.body = parse(str)
    } catch (err) {
      next(createError(400, err, {
        body: str,
        type: err.type || 'entity.parse.failed'
      }))
      return
    }

    next()
  })
}
```
[Link to code][reader]  Some optional code is omitted to make reading easier

## License

Body-Parser has an [MIT][bodyparser-license] license:

 >Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Using the MIT license means that there are very limited restrictions in reusing the software.  The only requirement associated with an MIT license is that you include the MIT copyright notice with any copies of the software.  You may use the software for commercial use and may sell the software.


[index]: https://github.com/expressjs/body-parser/blob/master/index.js
[json]: https://github.com/expressjs/body-parser/blob/480b1cfe29af19c070f4ae96e0d598c099f42a12/lib/types/json.js#L50
[reader]: https://github.com/expressjs/body-parser/blob/480b1cfe29af19c070f4ae96e0d598c099f42a12/lib/read.js#L144
[bodyparser-license]: https://github.com/expressjs/body-parser/blob/480b1cfe29af19c070f4ae96e0d598c099f42a12/LICENSE 