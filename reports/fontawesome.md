# FontAwesome Free Open Source Report

## What does this technology accomplish for you?

This technology provides a robust and simple solution to including Font Icons into a React App. Typically on a site you would add a ```<script src=""></script>``` tag to load in a .ttf font from an external source. However FontAwesome created a library that includes a custom react component for adding fonts to your site.


## How does this technology accomplish what it does?

From the Programmer Perspective
```html
<FontAwesomeIcon icon={faComment} size="2x" />
```
What it actually does:

FontAwesomeIcon is a React Component that displays an icon. 

[What is actually happening][font-awesomeCompLink]:

Inside The FontAwesomeIcon component, the component takes the inputted value iconArgs and normalizes the string: 

```javascript 
  const iconLookup = normalizeIconArgs(iconArgs)
  ```

Then the Lookup is passed into the function associated with 'icon'  from '@fortawesome/fontawesome-svg-core'

```javascript

const renderedIcon = icon(iconLookup, {
    ...classes,
    ...transform,
    ...mask,
    symbol,
    title
  })
```

<details>
  <summary>Click to expand and see the icon function</summary>
  
  ##  ['icon' from '@fortawesome/fontawesome-svg-core'][icon-var]
```javascript

  var icon = resolveIcons(function (iconDefinition) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _params$transform = params.transform,
        transform = _params$transform === void 0 ? meaninglessTransform : _params$transform,
        _params$symbol = params.symbol,
        symbol = _params$symbol === void 0 ? false : _params$symbol,
        _params$mask = params.mask,
        mask = _params$mask === void 0 ? null : _params$mask,
        _params$title = params.title,
        title = _params$title === void 0 ? null : _params$title,
        _params$classes = params.classes,
        classes = _params$classes === void 0 ? [] : _params$classes,
        _params$attributes = params.attributes,
        attributes = _params$attributes === void 0 ? {} : _params$attributes,
        _params$styles = params.styles,
        styles = _params$styles === void 0 ? {} : _params$styles;
    if (!iconDefinition) return;
    var prefix = iconDefinition.prefix,
        iconName = iconDefinition.iconName,
        icon = iconDefinition.icon;
    return apiObject(_objectSpread({
      type: 'icon'
    }, iconDefinition), function () {
      ensureCss();

      if (config.autoA11y) {
        if (title) {
          attributes['aria-labelledby'] = "".concat(config.replacementClass, "-title-").concat(nextUniqueId());
        } else {
          attributes['aria-hidden'] = 'true';
          attributes['focusable'] = 'false';
        }
      }

      return makeInlineSvgAbstract({
        icons: {
          main: asFoundIcon(icon),
          mask: mask ? asFoundIcon(mask.icon) : {
            found: false,
            width: null,
            height: null,
            icon: {}
          }
        },
        prefix: prefix,
        iconName: iconName,
        transform: _objectSpread({}, meaninglessTransform, transform),
        symbol: symbol,
        title: title,
        extra: {
          attributes: attributes,
          styles: styles,
          classes: classes
        }
      });
    });
  });
```
</details>


If the icon was successfully matched with a font-awesome icon it will render to the Dom a React Element containing the SVG icon.

```javascript
  if (!renderedIcon) {
    log('Could not find icon', iconLookup)
    return null
  }

  const { abstract } = renderedIcon
  const extraProps = {}

  Object.keys(props).forEach(key => {
    // eslint-disable-next-line no-prototype-builtins
    if (!FontAwesomeIcon.defaultProps.hasOwnProperty(key)) {
      extraProps[key] = props[key]
    }
  })

  return convertCurry(abstract[0], extraProps)
```
```javascript
const convertCurry = convert.bind(null, React.createElement)
```











## Licensing

The following was copied from the [Font Awesome page on licensing][fa-license]:
<details>
<summary>Licensing Information</summary>

* ### Icons
    In the Font Awesome Free download, the CC BY 4.0 license applies to all icons packaged as .svg and .js files types. 
* ### Fonts
    In the Font Awesome Free download, the SIL OFL license applies to all icons packaged as web and desktop font files. 
* ### Code
    In the Font Awesome Free download, the MIT license applies to all non-font and non-icon files. 
* ### Attribution
    Attribution is required by MIT, SIL OFL, and CC BY licenses. Downloaded Font Awesome Free files already contain embedded comments with sufficient attribution, so you shouldn't need to do anything additional when using these files normally.

    We've kept attribution comments terse, so we ask that you do not actively work to remove them from files, especially code. They're a great way for folks to learn about Font Awesome. 

Dos | Don'ts
------------ | -------------
Use FA Free in your commercial projects. |      Use the Font Awesome name in the name of your project.
Use FA Free on your websites. | 
Embed FA Free in your mobile and desktop apps. |
Use FA Free in desktop apps. |
Embed FA Free in documents. (e.g. .pdf, .doc, etc.) |

</details>

This essentially means that as long as we don't use Font Awesome's name in the name of our project (see above), we can use Font Awesome Free for whatever purposes we need it for.






[fa-license]: https://fontawesome.com/license/free
[node-parser]: https://github.com/nodejs/node/blob/master/src/node_http_parser.cc

[icon-var]: https://github.com/FortAwesome/Font-Awesome/blob/master/js-packages/%40fortawesome/fontawesome-svg-core/index.js#L2255
[font-awesomeCompLink]: https://github.com/FortAwesome/react-fontawesome/blob/master/src/components/FontAwesomeIcon.js
