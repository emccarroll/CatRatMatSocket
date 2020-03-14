# Node Open Source Report
## What does this technology accomplish for you?

Node.js is an open source, cross platform Javascript runtime environment that allows us to execute Javascript code outside of the browser. With node.js you can build fully fledged web applications using Javascript. By having Javascript run on the server, you can create dynamic web page content before it is sent to the client.

Node.js serves as an HTTP server for our React frontend pages. The conventional way to create a React app is to run it using Node.js.

## How does this technology accomplish what it does?

As illustrated here, Node.js uses C++ to parse HTTP. What I've tried to illustrate here is that the C++ code will take in some HTTP data, decide whether it is a request or a response and then will set an async wrapper so that it can send the appropriate response. 

```cpp
    CHECK(type == HTTP_REQUEST || type == HTTP_RESPONSE);
    Parser* parser;
    ASSIGN_OR_RETURN_UNWRAP(&parser, args.Holder());
    // Should always be called from the same context.
    CHECK_EQ(env, parser->env());

    AsyncWrap::ProviderType provider =
        (type == HTTP_REQUEST ?
            AsyncWrap::PROVIDER_HTTPINCOMINGMESSAGE
            : AsyncWrap::PROVIDER_HTTPCLIENTREQUEST);

    parser->set_provider_type(provider);
    parser->AsyncReset(args[1].As<Object>());
    parser->Init(type, max_http_header_size, lenient);
```
[Link to code][node-parser]
## Licensing
>Copyright Node.js contributors. All rights reserved.
>
>Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
>
>...dependency licenses...

[Link to license][node-license]

This license is very similar to the MIT license. It allows us to use the software for basically any purpose as long as we include the above copyright notice in our software.





[node-license]: https://github.com/nodejs/node/blob/master/LICENSE
[node-parser]: https://github.com/nodejs/node/blob/master/src/node_http_parser.cc
