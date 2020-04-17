# Multer Open Source Report
## What does this technology accomplish for you?
>"Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files." 

We use it in our project to handle uploading post images to the backend server.

## How does this technology accomplish what it does?
Multer uses "busboy", which apparently handles the multipart/form-data information pretty abstractly. Here's some code that I found which details how multer reads multipart/form-data from the post request for text:

```javascript
 // handle text field data
    busboy.on('field', function (fieldname, value, fieldnameTruncated, valueTruncated) {
      if (fieldnameTruncated) return abortWithCode('LIMIT_FIELD_KEY')
      if (valueTruncated) return abortWithCode('LIMIT_FIELD_VALUE', fieldname)

      // Work around bug in Busboy (https://github.com/mscdex/busboy/issues/6)
      if (limits && limits.hasOwnProperty('fieldNameSize')) {
        if (fieldname.length > limits.fieldNameSize) return abortWithCode('LIMIT_FIELD_KEY')
      }

      appendField(req.body, fieldname, value)
    })
```
[Link to repository][multer]

What I found funny here was that the busboy code apparently doesn't automatically handle field names which are too large. Anyway, I thought this was a pretty simple example of how multer is processing the form data in the background.

## [Licensing][multer-license]
>Copyright (c) 2014 Hage Yaapa <[http://www.hacksparrow.com](http://www.hacksparrow.com)>
>
>Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Very similar to all the other dependencies we've used, Multer is using an MIT license which means that we are free to use this software for basically whatever we want as long as we don't place legal liability on the developers of Multer.




[multer-license]: https://github.com/expressjs/multer/blob/master/LICENSE
[multer]: https://github.com/expressjs/multer
