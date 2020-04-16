# Express Open-Source Report

## What does Express accomplish for us?

Express is a technology used on the server side of web applications that handles multiple different http requests at different urls.  Express will handle the routing of urls on the backend and respond with any response we desire.  This could be data, static html, static css, images, etc. 

## How does Express accomplish what it does?

* ### Creation of the express server
    Through calling ```const app = express();``` to initialize express, an instance of a node server is returned as shown in the code snippet below. This is responsible for the TCP layer of express.
    ```javascript
        /**
        * Listen for connections.
        *
        * A node `http.Server` is returned, with this
        * application (which is a `Function`) as its
        * callback. If you wish to create both an HTTP
        * and HTTPS server you may do so with the "http"
        * and "https" modules as shown here:
        *
        *    var http = require('http')
        *      , https = require('https')
        *      , express = require('express')
        *      , app = express();
        *
        *    http.createServer(app).listen(80);
        *    https.createServer({ ... }, app).listen(443);
        *
        * @return {http.Server}
        * @public
        */

        app.listen = function listen() {
            var server = http.createServer(this);
            return server.listen.apply(server, arguments);
        };
    ```
    [Link to code][init]
* ### Verbs
    Once our express connection is established and listening for http requests, we can parse it to determine if it's a GET, POST, PUT, etc request. This takes place in the application.js file.

    ```javascript
        /**
        * Delegate `.VERB(...)` calls to `router.VERB(...)`.
        */

        methods.forEach(function(method){
            app[method] = function(path){
                if (method === 'get' && arguments.length === 1) {
                    // app.get(setting)
                    return this.set(path);
                }

                this.lazyrouter();

                var route = this._router.route(path);
                route[method].apply(route, slice.call(arguments, 1));
                return this;
            };
        });
    ```    
    [Link to code][verbs]

* ### Routing
    Our routing is done in the index.js file. This code handles a new route in the index.js file. rach route contains its own VERB handler very similar to the above app handler's. The difference comes with the creation of a Layer which is pushed onto a stack. The Layers are discussed in the next section.

    ```javascript
        /**
        * Create a new Route for the given path.
        *
        * Each route contains a separate middleware stack and VERB handlers.
        *
        * See the Route api documentation for details on adding handlers
        * and middleware to routes.
        *
        * @param {String} path
        * @return {Route}
        * @public
        */

        proto.route = function route(path) {
        var route = new Route(path);

        var layer = new Layer(path, {
            sensitive: this.caseSensitive,
            strict: this.strict,
            end: true
        }, route.dispatch.bind(route));

        layer.route = route;

        this.stack.push(layer);
        return route;
        };
    ```
    [Link to Code][Routing]

* ### Layers
    Layers are used to keep track and organize a specific route. For example, in our app /posts has its own default route, but it can also handle /posts/add and will eventually handle /posts/remove. The stack nature will allow for iteration over these routes. Each layer has a function handler to execute as shown below.


    ```javascript
        function Layer(path, options, fn) {

            this.path = undefined;
            this.handle = fn;

        }
    ```

    [Link to Code][Layers]

* ### Handling the HTTP request

    Each route and router will loop through each of its layers and call their respective handle_request methods. This can be seen in route.js code below.

    ```javascript
        Route.prototype.dispatch = function dispatch(req, res, done) {
            var stack = this.stack;

            next();

            function next(err) {
                var layer = stack[idx++];
                layer.handle_request(req, res, next);
            }
        };
    ```
    [Link to Code][http]

    The photo below encapsulates all of the steps express goes through when receiving and responding to each http request. Route layers are encapsulated in routes, routes are encapsulated inside of router layers, and routers are encapsulated inside of the initialized express app. The stacks of layers are iterated over until the proper rote is found, and then the respective handlerFunctions are executed, and the respective http request is responded to.

    ![alt text](https://www.sohamkamani.com/267bfd0839b56afc11b097382797ae8d/express-routing-http.svg "Logo Title Text 1")

    [Image Source][img]



## License

Express has an [MIT][Express] license:

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

[Express-license]: https://github.com/expressjs/express/blob/master/LICENSE
[init]: https://github.com/expressjs/express/blob/3ed5090ca91f6a387e66370d57ead94d886275e1/lib/application.js#L616
[verbs]: https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/application.js#L472
[Routing]: https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/router/index.js#L491
[Layers]: https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/router/layer.js#L33
[img]:https://www.sohamkamani.com/267bfd0839b56afc11b097382797ae8d/express-routing-http.svg
[http]:https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/router/route.js#L98

