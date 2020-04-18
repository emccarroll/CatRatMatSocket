# Cookie-parser Open-Source Report

## What does cookie-parser accomplish for us?

Cookie-parser is a simple tool that parses cookies attached to client request objects. It is used in the middleware which in our case is the server.js on the back end.

## How does cookie-parser accomplish what it does?

Cookie-parser depends on the cookie and cookie-signature libraries which handle the low-level connections.

* ### Flow of execution

We see below that in our main cookieParser function we handle the request's cookies using the default cookie library. We then pass those cookies as a raw string into our `JSONCookies()` function.

```javascript
function cookieParser (req, res, next) {
    //...

    req.cookies = cookie.parse(cookies, options)

    // parse JSON cookies
    req.cookies = JSONCookies(req.cookies)

    //...
  }
```
[Link to code][cookieParser]

Below is our `JSONCookies()` function definition. In this function we are simply iterating over every cookie and pairing it with its proper key. It depends on the `JSONCookie()` function.

```javascript
    /**
     * Parse JSON cookies.
     *
     * @param {Object} obj
     * @return {Object}
     * @public
     */

    function JSONCookies (obj) {
    var cookies = Object.keys(obj)
    var key
    var val

    for (var i = 0; i < cookies.length; i++) {
        key = cookies[i]
        val = JSONCookie(obj[key])

        if (val) {
        obj[key] = val
        }
    }

    return obj
    }
```
[Link to code][jsonCookies]

Below is the `JSONCookie()` function. Here we slice the string and pass it into the built in JSON parser.

```javascript
    /**
     * Parse JSON cookie string.
     *
     * @param {String} str
     * @return {Object} Parsed object or undefined if not json cookie
     * @public
     */
    function JSONCookie (str) {
    if (typeof str !== 'string' || str.substr(0, 2) !== 'j:') {
        return undefined
    }

    try {
        return JSON.parse(str.slice(2))
    } catch (err) {
        return undefined
    }
    }
```
[Link to code][jsonCookie]

After this function completes, we continue iterating over our cookies and eventually have a nice and easy JSON object returned to us.

## License

Cookie-parser has an [MIT][license] license:

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

[cookieParser]:https://github.com/expressjs/cookie-parser/blob/6918b5081aec7d76072a17359106ff9b5d39a487/index.js#L39
[jsonCookies]:https://github.com/expressjs/cookie-parser/blob/6918b5081aec7d76072a17359106ff9b5d39a487/index.js#L103
[jsonCookie]:https://github.com/expressjs/cookie-parser/blob/6918b5081aec7d76072a17359106ff9b5d39a487/index.js#L83
[license]:https://github.com/expressjs/cookie-parser/blob/master/LICENSE