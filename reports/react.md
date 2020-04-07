# React Open-Source Report

## What does React accomplish for us?

React is a [Javascript library for building user interfaces][React-website]. You are able to design each individual state in your program and React will render the appropriate material for you quickly and efficiently.  It’s also compatible with any backend. The API is well defined to allow a simple flow of data from your frontend to backend, and vice-versa.

## How does React accomplish what it does?

* ### Virtual DOM
    Each tagged element in HTML is represented as a Virtual DOM object in ReactJS.  Virtual DOM is a JS object that mimics the browser’s DOM, but is highly optimized compared to the browser’s DOM. The Virtual DOM is represented as a ReactElement, seen in the source code below.
    ```javascript
        /**
        * Factory method to create a new React element. This no longer adheres to
        * the class pattern, so do not use new to call it. Also, instanceof check
        * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
        * if something is a React Element.
        *
        * @param {*} type
        * @param {*} props
        * @param {*} key
        * @param {string|object} ref
        * @param {*} owner
        * @param {*} self A *temporary* helper to detect places where `this` is
        * different from the `owner` when React.createElement is called, so that we
        * can warn. We want to get rid of owner and replace string `ref`s with arrow
        * functions, and as long as `this` and owner are the same, there will be no
        * change in behavior.
        * @param {*} source An annotation object (added by a transpiler or otherwise)
        * indicating filename, line number, and/or other information.
        * @internal
        */
        const ReactElement = function(type, key, ref, self, source, owner, props) {
         const element = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: REACT_ELEMENT_TYPE,
    ```
    [Link to code][Virtual-DOM]
* ### Diffing Algorithm
    You have a DOM when the website loads. You click something, and a new DOM is generated.  How does it know what to change? And how does it do it efficiently?  
    It uses the React diffing algorithm.  
    This algorithm puts each tag into a tree. Each node is a ReactElement seen above. Different tags have different trees i.e. \<a> and \<p> will have separate trees. Any change to a tag will lead to a complete rebuild of its subtree. Optimizations are included to ensure fast and efficient updates to each object. The algorithm can be found in the ReactNativeAttributePayload.js file.

    ```javascript
        /**
        * Create a payload that contains all the updates between two sets of props.
        *
        * These helpers are all encapsulated into a single module, because they use
         * mutation as a performance optimization which leads to subtle shared
        * dependencies between the code paths. To avoid this mutable state leaking
        * across modules, I've kept them isolated to this module.
        */

        type NestedNode = Array<NestedNode> | Object;

        // Tracks removed keys
        let removedKeys = null;
        let removedKeyCount = 0;

        const deepDifferOptions = {
         unsafelyIgnoreFunctions: true,
        };

        function defaultDiffer(prevProp: mixed, nextProp: mixed): boolean {
        if (typeof nextProp !== 'object' || nextProp === null) {
            // Scalars have already been checked for equality
         return true;
        } else {
          // For objects and arrays, the default diffing algorithm is a deep compare
           return deepDiffer(prevProp, nextProp, deepDifferOptions);
         }
        }
    ```    
[Link to code][Diffing]

## License

React has an [MIT][React-license] license:

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

[React-license]: https://github.com/facebook/react/blob/master/LICENSE
[React-website]: https://reactjs.org/
[Virtual-dom]: https://github.com/facebook/react/blob/3b3decf87121dcc20bfc0820b7b35d2b028adaf2/packages/react/src/ReactElement.js
[Diffing]: https://github.com/facebook/react/blob/38dd17ab98ce288fd0d0b68682a6df0f0a49e158/packages/react-native-renderer/src/ReactNativeAttributePayload.js

