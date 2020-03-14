# React Router Open-Source Report

## What does React Router accomplish for us?
React Router is an extension for React that allows us to route web traffic from the users. It makes sure that they are seeing the right content when they navigate to different paths on the website by changing the state of the application. 

## How does React Router accomplish what it does?

When we are using react-router in App.js, we actually pull in reacter-router-dom. However, this is just a way for react-router to interface with the DOM, so we will be showing the code of react-router. 

The router class will listen for location changes and if there are it will alter the component to show this change.
<details>
<summary>Router Code</summary>

```javascript
var Router =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(Router, _React$Component);

  Router.computeRootMatch = function computeRootMatch(pathname) {
    return {
      path: "/",
      url: "/",
      params: {},
      isExact: pathname === "/"
    };
  };

  function Router(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      location: props.history.location
    }; // This is a bit of a hack. We have to start listening for location
    // changes here in the constructor in case there are any <Redirect>s
    // on the initial render. If there are, they will replace/push when
    // they mount and since cDM fires in children before parents, we may
    // get a new location before the <Router> is mounted.

    _this._isMounted = false;
    _this._pendingLocation = null;

    if (!props.staticContext) {
      _this.unlisten = props.history.listen(function (location) {
        if (_this._isMounted) {
          _this.setState({
            location: location
          });
        } else {
          _this._pendingLocation = location;
        }
      });
    }

    return _this;
  }
```

</details>

## Licensing
React router is [released under the MIT license][rrouter-license]. This means that we can freely modify and distribute it as long as we include the license in a portion of our software.

[rrouter-license]: https://github.com/ReactTraining/react-router/blob/master/LICENSE