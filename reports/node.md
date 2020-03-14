# Node Open Source Report
## What does this technology accomplish for you?

Node.js is an open source, cross platform javascript runtime environment that allows us to execute javascript code outside of the browser. With node.js you can build fully fledged Web Applications using javascript. By having javascript run on the server, you can create dynamic web page content before it is sent to the client.

Node.js serves as an HTTP server for our React Front End Pages. The Conventional way to create a React app is to run it using Node.js.

## How does this technology accomplish what it does?

At the TCP socket server level Node.js 

```javascript
        // This is a binding to llhttp (https://github.com/nodejs/llhttp)
        // The goal is to decouple sockets from parsing for more javascript-level
        // agility. A Buffer is read from a socket and passed to parser.execute().
        // The parser then issues callbacks with slices of the data
        //     parser.onMessageBegin
        //     parser.onPath
        //     parser.onBody
        //     ...
        // No copying is performed when slicing the buffer, only small reference
        // allocations.
```
[Link to code][node-parser]

[node-parser]: https://github.com/nodejs/node/blob/master/src/node_http_parser.cc
