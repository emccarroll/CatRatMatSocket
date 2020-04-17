# Mongoose Open Source Report
## What does this technology accomplish for you?
>Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.

As mentioned above, we use Mongoose to abstract data storage and retrieval from the backend. It lets us define "Schemas" which are abstract objects that facilitate this transfer of data. We use this to store and retrive both posts and user accounts.

## How does this technology accomplish what it does?


```javascript
 const promise = new Promise((resolve, reject) => {
    const client = new mongodb.MongoClient(uri, options);
    _this.client = client;
    client.connect(function(error) {
      if (error) {
        _this.readyState = STATES.disconnected;
        return reject(error);
      }

      const db = dbName != null ? client.db(dbName) : client.db();
      _this.db = db;
```
From what I can tell from this piece of code, connections to the database are facilitated through mongodb, and then wrapped by Mongoose. This makes sense because as stated above, Mongoose is a tool meant to asyncronously handle connections to the underlying MongoDB, so it wouldn't need to reimplement mongodb as long as it can utilize javascript's asyncronous toolset to access the DB.

[Link to repository][repo]



## [Licensing][license]
># MIT License
>
>Copyright (c) 2010 LearnBoost <dev@learnboost.com>
>
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

Very similar to all the other dependencies we've used, Mongoose is using an MIT license which means that we are free to use this software for basically whatever we want as long as we don't place legal liability on the developers of Mongoose.





[license]: https://github.com/Automattic/mongoose/blob/master/LICENSE.md
[repo]: https://github.com/Automattic/mongoose
