# Socket.io Open-Source Report

## What does Socket.io accomplish for us?

Socket.io is a critical tool in implementing a real-time web application. Socket.io allows data to update instantaneously for all users connected on the server's socket. In our case it allows posts to be updated in real time every time a user submits a post.

## How does Socket.io accomplish what it does?

* ### Intro 
    Socket.io uses a very complex architecture to achieve what it does. Below is a diagram showing the flow of the library. The code base is split into several separate repositories all of which are listed in the diagram below.

    ![alt text](https://socket.io/images/dependencies.jpg "Socket.io architecture")
    [Image Source][image]

    The lowest level socket.io goes is the http level, as it uses Node's built in http library. We can see it's include header in the index.js file in the socket.io repo.
    ```javascript
        var http = require('http');
    ```
    [Link to code][intro]

* ### Handshake

    The flow of socket.io begins with an HTTP handshake. We can see the handshake built in the lib/socket.js folder of the socket.io repository.

    ```javascript
        Socket.prototype.buildHandshake = function(query){
        var self = this;
        function buildQuery(){
            var requestQuery = url.parse(self.request.url, true).query;
            //if socket-specific query exist, replace query strings in requestQuery
            return Object.assign({}, query, requestQuery);
        }
        return {
            headers: this.request.headers,
            time: (new Date) + '',
            address: this.conn.remoteAddress,
            xdomain: !!this.request.headers.origin,
            secure: !!this.request.connection.encrypted,
            issued: +(new Date),
            url: this.request.url,
            query: buildQuery()
        };
        };
    ```
    [Link to code][http]

    The clients side of the handshake can be seen in the server.js file of socket.io-client reposiotry.
    ```javascript
        socket.on('getHandshake', function (cb) {
            cb(socket.handshake);
        });
    ```
    [Link to code][client-http]
        

* ### Encoding and Decoding
    Similar to our homework, we must encode and decode packets to communicate. These functions are found in the socket.io-parser repository.
    Here is the encoding code:
    ```javascript
    /**
    * Encode packet as string.
    *
    * @param {Object} packet
    * @return {String} encoded
    * @api private
    */

    function encodeAsString(obj) {

    // first is type
    var str = '' + obj.type;

    // attachments if we have them
    if (exports.BINARY_EVENT === obj.type || exports.BINARY_ACK === obj.type) {
        str += obj.attachments + '-';
    }

    // if we have a namespace other than `/`
    // we append it followed by a comma `,`
    if (obj.nsp && '/' !== obj.nsp) {
        str += obj.nsp + ',';
    }

    // immediately followed by the id
    if (null != obj.id) {
        str += obj.id;
    }

    // json data
    if (null != obj.data) {
        var payload = tryStringify(obj.data);
        if (payload !== false) {
        str += payload;
        } else {
        return ERROR_PACKET;
        }
    }

    debug('encoded %j as %s', obj, str);
    return str;
    }

    ```

    and decoding:

    ```javascript
    /**
    * Decode a packet String (JSON data)
    *
    * @param {String} str
    * @return {Object} packet
    * @api private
    */

    function decodeString(str) {
    var i = 0;
    // look up type
    var p = {
        type: Number(str.charAt(0))
    };

    if (null == exports.types[p.type]) {
        return error('unknown packet type ' + p.type);
    }

    // look up attachments if type binary
    if (exports.BINARY_EVENT === p.type || exports.BINARY_ACK === p.type) {
        var buf = '';
        while (str.charAt(++i) !== '-') {
        buf += str.charAt(i);
        if (i == str.length) break;
        }
        if (buf != Number(buf) || str.charAt(i) !== '-') {
        throw new Error('Illegal attachments');
        }
        p.attachments = Number(buf);
    }

    // look up namespace (if any)
    if ('/' === str.charAt(i + 1)) {
        p.nsp = '';
        while (++i) {
        var c = str.charAt(i);
        if (',' === c) break;
        p.nsp += c;
        if (i === str.length) break;
        }
    } else {
        p.nsp = '/';
    }

    // look up id
    var next = str.charAt(i + 1);
    if ('' !== next && Number(next) == next) {
        p.id = '';
        while (++i) {
        var c = str.charAt(i);
        if (null == c || Number(c) != c) {
            --i;
            break;
        }
        p.id += str.charAt(i);
        if (i === str.length) break;
        }
        p.id = Number(p.id);
    }

    // look up json data
    if (str.charAt(++i)) {
        var payload = tryParse(str.substr(i));
        var isPayloadValid = payload !== false && (p.type === exports.ERROR || isArray(payload));
        if (isPayloadValid) {
        p.data = payload;
        } else {
        return error('invalid payload');
        }
    }

    debug('decoded %s as %j', str, p);
    return p;
    }
    ```

    [Link to code][encode]

* ### Engine.io

    As stated in the offical documentation, the role of engine.io is ```the implementation of transport-based cross-browser/cross-device bi-directional communication layer for Socket.IO.``` It also contains its own packet encoder and decoder located [here][engineio]

[image]:https://socket.io/images/dependencies.jpg
[intro]:https://github.com/socketio/socket.io/blob/df05b73bb93d7c34c758504001f869cb156703d5/lib/index.js#L7
[http]:https://github.com/expressjs/express/blob/c0136d8b48dd3526c58b2ad8666fb4b12b55116c/lib/router/route.js#L98
[client-http]:https://github.com/socketio/socket.io-client/blob/8372591652260f88987c467b94573a144ee4db63/test/support/server.js#L145
[encode]:https://github.com/socketio/socket.io-parser/blob/652402a8568c2138da3c27c96756b32efca6c4bf/index.js#L139
[engineio]:https://github.com/socketio/engine.io-parser/blob/master/lib/index.js
