# Bootstrap Open Source Report
## What does this technology accomplish for you?

Bootstrap provides us with a surplus of premade css classes which we can use on html tags of our site to rapidly make our site look nicer.
Bootstrap also has a grid system which helps to lay out content on the screen in an organized way. The Bootstrap grid can also be responsive, allowing content on the page to be rearranged based on the width of the device.

## How does this technology accomplish what it does?

Bootstrap's Grid generates its default 12 columns by making each column an equal percentage of the viewport width. 
```css

// Framework grid generation
//
// Used only by Bootstrap to generate the correct number of grid classes given
// any value of `$grid-columns`.

@mixin make-grid-columns($columns: $grid-columns, $gutter: $grid-gutter-width, $breakpoints: $grid-breakpoints) {
  @each $breakpoint in map-keys($breakpoints) {
    $infix: breakpoint-infix($breakpoint, $breakpoints);

    @include media-breakpoint-up($breakpoint, $breakpoints) {
      // Provide basic `.col-{bp}` classes for equal-width flexbox columns
      .col#{$infix} {
        flex: 1 0 0%; // Flexbugs #4: https://github.com/philipwalton/flexbugs#flexbug-4
        min-width: 0; // See https://github.com/twbs/bootstrap/issues/25410
      }

      .row-cols#{$infix}-auto > * {
        @include make-col-auto();
      }

      @for $i from 1 through $grid-row-columns {
        .row-cols#{$infix}-#{$i} {
          @include row-cols($i);
        }
      }

      .col#{$infix}-auto {
        @include make-col-auto();
      }

      @for $i from 1 through $columns {
        .col#{$infix}-#{$i} {
          @include make-col($i, $columns);
        }
      }

      // `$columns - 1` because offsetting by the width of an entire row isn't possible
      @for $i from 0 through ($columns - 1) {
        @if not ($infix == "" and $i == 0) { // Avoid emitting useless .offset-0
          .offset#{$infix}-#{$i} {
            @include make-col-offset($i, $columns);
          }
        }
      }
    }
  }
https://github.com/twbs/bootstrap/blob/master/scss/mixins/_grid.scss
```

Source Code for Form Styling:
```css
.form-file {
  position: relative;
  height: $form-file-height;
}

.form-file-input {
  position: relative;
  z-index: 2;
  width: 100%;
  height: $form-file-height;
  margin: 0;
  opacity: 0;

  // Separate rules for :focus and :focus-within as IE doesnt support the latter, and
  // thus ignores the entire ruleset. See https://github.com/twbs/bootstrap/pull/29036.
  &:focus ~ .form-file-label {
    border-color: $form-file-focus-border-color;
    box-shadow: $form-file-focus-box-shadow;
  }

  &:focus-within ~ .form-file-label {
    border-color: $form-file-focus-border-color;
    box-shadow: $form-file-focus-box-shadow;
  }

  // Use disabled attribute in addition of :disabled pseudo-class
  // See: https://github.com/twbs/bootstrap/issues/28247
  &[disabled] ~ .form-file-label .form-file-text,
  &:disabled ~ .form-file-label .form-file-text {
    background-color: $form-file-disabled-bg;
    border-color: $form-file-disabled-border-color;
  }
}

.form-file-label {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  display: flex;
  height: $form-file-height;
  border-color: $form-file-border-color;
  @include border-radius($form-file-border-radius);
  @include box-shadow($form-file-box-shadow);
}

.form-file-text {
  display: block;
  flex-grow: 1;
  padding: $form-file-padding-y $form-file-padding-x;
  overflow: hidden;
  font-family: $form-file-font-family;
  font-weight: $form-file-font-weight;
  line-height: $form-file-line-height;
  color: $form-file-color;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: $form-file-bg;
  border-color: inherit;
  border-style: solid;
  border-width: $form-file-border-width;
  @include border-left-radius(inherit);
}

.form-file-button {
  display: block;
  flex-shrink: 0;
  padding: $form-file-padding-y $form-file-padding-x;
  margin-left: -$form-file-border-width;
  line-height: $form-file-line-height;
  color: $form-file-button-color;
  @include gradient-bg($form-file-button-bg);
  border-color: inherit;
  border-style: solid;
  border-width: $form-file-border-width;
  @include border-right-radius(inherit);
}
https://github.com/twbs/bootstrap/blob/master/scss/forms/_form-file.scss
```

## Navbar CSS ##

```css
https://github.com/twbs/bootstrap/blob/master/scss/_navbar.scss

// Contents
//
// Navbar
// Navbar brand
// Navbar nav
// Navbar text
// Responsive navbar
// Navbar position
// Navbar themes


// Navbar
//
// Provide a static navbar from which we expand to create full-width, fixed, and
// other navbar variations.

.navbar {
  position: relative;
  display: flex;
  flex-wrap: wrap; // allow us to do the line break for collapsing content
  align-items: center;
  justify-content: space-between; // space out brand from logo
  padding-top: $navbar-padding-y;
  padding-right: $navbar-padding-x; // default: null
  padding-bottom: $navbar-padding-y;
  padding-left: $navbar-padding-x; // default: null

  // Because flex properties aren't inherited, we need to redeclare these first
  // few properties so that content nested within behave properly.
  // The `flex-wrap` property is inherited to simplify the expanded navbars
  %container-flex-properties {
    display: flex;
    flex-wrap: inherit;
    align-items: center;
    justify-content: space-between;
  }

  > .container,
  > .container-fluid {
    @extend %container-flex-properties;
  }

  @each $breakpoint, $container-max-width in $container-max-widths {
    > .container#{breakpoint-infix($breakpoint, $container-max-widths)} {
      @extend %container-flex-properties;
    }
  }
}


// Navbar brand
//
// Used for brand, project, or site names.

.navbar-brand {
  padding-top: $navbar-brand-padding-y;
  padding-bottom: $navbar-brand-padding-y;
  margin-right: $navbar-brand-margin-right;
  @include font-size($navbar-brand-font-size);
  white-space: nowrap;

  &:hover,
  &:focus {
    text-decoration: none;
  }
}


// Navbar nav
//
// Custom navbar navigation (doesn't require `.nav`, but does make use of `.nav-link`).

.navbar-nav {
  display: flex;
  flex-direction: column; // cannot use `inherit` to get the `.navbar`s value
  padding-left: 0;
  margin-bottom: 0;
  list-style: none;

  .nav-link {
    padding-right: 0;
    padding-left: 0;
  }

  .dropdown-menu {
    position: static;
  }
}


// Navbar text
//
//

.navbar-text {
  padding-top: $nav-link-padding-y;
  padding-bottom: $nav-link-padding-y;
}


// Responsive navbar
//
// Custom styles for responsive collapsing and toggling of navbar contents.
// Powered by the collapse Bootstrap JavaScript plugin.

// When collapsed, prevent the toggleable navbar contents from appearing in
// the default flexbox row orientation. Requires the use of `flex-wrap: wrap`
// on the `.navbar` parent.
.navbar-collapse {
  flex: 1 0 100%;
  // For always expanded or extra full navbars, ensure content aligns itself
  // properly vertically. Can be easily overridden with flex utilities.
  align-items: center;
}

// Button for toggling the navbar when in its collapsed state
.navbar-toggler {
  padding: $navbar-toggler-padding-y $navbar-toggler-padding-x;
  @include font-size($navbar-toggler-font-size);
  line-height: 1;
  background-color: transparent; // remove default button style
  border: $border-width solid transparent; // remove default button style
  @include border-radius($navbar-toggler-border-radius);
  @include transition($navbar-toggler-transition);

  &:hover {
    text-decoration: none;
  }

  &:focus {
    text-decoration: none;
    outline: 0;
    box-shadow: 0 0 0 $navbar-toggler-focus-width;
  }
}

// Keep as a separate element so folks can easily override it with another icon
// or image file as needed.
.navbar-toggler-icon {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  vertical-align: middle;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}

// Generate series of `.navbar-expand-*` responsive classes for configuring
// where your navbar collapses.
.navbar-expand {
  @each $breakpoint in map-keys($grid-breakpoints) {
    $next: breakpoint-next($breakpoint, $grid-breakpoints);
    $infix: breakpoint-infix($next, $grid-breakpoints);

    &#{$infix} {
      @include media-breakpoint-up($next) {
        flex-wrap: nowrap;
        justify-content: flex-start;

        .navbar-nav {
          flex-direction: row;

          .dropdown-menu {
            position: absolute;
          }

          .nav-link {
            padding-right: $navbar-nav-link-padding-x;
            padding-left: $navbar-nav-link-padding-x;
          }
        }

        .navbar-collapse {
          display: flex !important; // stylelint-disable-line declaration-no-important

          // Changes flex-bases to auto because of an IE10 bug
          flex-basis: auto;
        }

        .navbar-toggler {
          display: none;
        }
      }
    }
  }
}


// Navbar themes
//
// Styles for switching between navbars with light or dark background.

// Dark links against a light background
.navbar-light {
  .navbar-brand {
    color: $navbar-light-brand-color;

    &:hover,
    &:focus {
      color: $navbar-light-brand-hover-color;
    }
  }

  .navbar-nav {
    .nav-link {
      color: $navbar-light-color;

      &:hover,
      &:focus {
        color: $navbar-light-hover-color;
      }

      &.disabled {
        color: $navbar-light-disabled-color;
      }
    }

    .show > .nav-link,
    .active > .nav-link,
    .nav-link.show,
    .nav-link.active {
      color: $navbar-light-active-color;
    }
  }

  .navbar-toggler {
    color: $navbar-light-color;
    border-color: $navbar-light-toggler-border-color;
  }

  .navbar-toggler-icon {
    background-image: escape-svg($navbar-light-toggler-icon-bg);
  }

  .navbar-text {
    color: $navbar-light-color;

    a,
    a:hover,
    a:focus  {
      color: $navbar-light-active-color;
    }
  }
}

// White links against a dark background
.navbar-dark {
  .navbar-brand {
    color: $navbar-dark-brand-color;

    &:hover,
    &:focus {
      color: $navbar-dark-brand-hover-color;
    }
  }

  .navbar-nav {
    .nav-link {
      color: $navbar-dark-color;

      &:hover,
      &:focus {
        color: $navbar-dark-hover-color;
      }

      &.disabled {
        color: $navbar-dark-disabled-color;
      }
    }

    .show > .nav-link,
    .active > .nav-link,
    .nav-link.show,
    .nav-link.active {
      color: $navbar-dark-active-color;
    }
  }

  .navbar-toggler {
    color: $navbar-dark-color;
    border-color: $navbar-dark-toggler-border-color;
  }

  .navbar-toggler-icon {
    background-image: escape-svg($navbar-dark-toggler-icon-bg);
  }

  .navbar-text {
    color: $navbar-dark-color;
    a,
    a:hover,
    a:focus {
      color: $navbar-dark-active-color;
    }
  }
}
```

