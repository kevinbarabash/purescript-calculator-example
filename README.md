# purescript-calculator-example

This example uses purescript-react-basic to implement a simple calculator. [demo](https://kevinbarabash.github.io/purescript-calculator-example/)

![calculator](calculator.png)

# Quick Start

- yarn build
- yarn bundle:puree

# Alternative Builds

- yarn bundle:rollup
- yarn bundle:pulp
- yarn bundle:purs

Notes: 
- bundle:rollup requires commenting out the following line in
  Web.HTML.HTMLTrackElement: `"default": $foreign["default"],` to build correctly.
- bundle.rollup.js requires changing `import 'react'` to `import './react.js'` and
  `import 'react-dom'` to `import './react-dom.js'` to run.
- bundle.purs.js and bundle.pulp.js require additional build steps to run since
  browsers can't require commonjs modules without additional help.
