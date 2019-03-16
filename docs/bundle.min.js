import { Component, createElement } from "./react.js";
import { render as render$1 } from "./react-dom.js";
var _unit = {};

var _showIntImpl = n => n.toString();

var _showNumberImpl = n => {
  var str = n.toString();
  return isNaN(str + ".0") ? str : str + ".0";
};

var Show = function (show) {
  this.show = show;
};

var showNumber = new Show(_showNumberImpl);
var showInt = new Show(_showIntImpl);

var show = dict => dict.show;

var _numDiv = n1 => n2 => n1 / n2;

var _numSub = n1 => n2 => n1 - n2;

var _numAdd = n1 => n2 => n1 + n2;

var _numMul = n1 => n2 => n1 * n2;

var Semigroupoid = function (compose) {
  this.compose = compose;
};

var semigroupoidFn = new Semigroupoid(f => g => x => f(g(x)));

var compose = dict => dict.compose;

var composeFlipped = dictSemigroupoid => f => g => compose(dictSemigroupoid)(g)(f);

var Category = function (Semigroupoid0, identity) {
  this.Semigroupoid0 = Semigroupoid0;
  this.identity = identity;
};

var identity = dict => dict.identity;

var categoryFn = new Category(() => semigroupoidFn, x => x);

var flip = f => b => a => f(a)(b);

var Functor = function (map) {
  this.map = map;
};

var map = dict => dict.map;

var Apply = function (Functor0, apply) {
  this.Functor0 = Functor0;
  this.apply = apply;
};

var apply = dict => dict.apply;

var Applicative = function (Apply0, pure) {
  this.Apply0 = Apply0;
  this.pure = pure;
};

var pure = dict => dict.pure;

var liftA1 = dictApplicative => f => a => apply(dictApplicative.Apply0())(pure(dictApplicative)(f))(a);

var Bind = function (Apply0, bind) {
  this.Apply0 = Apply0;
  this.bind = bind;
};

var bind = dict => dict.bind;

var Monad = function (Applicative0, Bind1) {
  this.Applicative0 = Applicative0;
  this.Bind1 = Bind1;
};

var ap = dictMonad => f => a => bind(dictMonad.Bind1())(f)(v => bind(dictMonad.Bind1())(a)(v1 => pure(dictMonad.Applicative0())(v(v1))));

var Nothing = (() => {
  function Nothing() {}

  Nothing.value = new Nothing();
  return Nothing;
})();

var Just = (() => {
  function Just(value0) {
    this.value0 = value0;
  }

  Just.create = value0 => new Just(value0);

  return Just;
})();

var _pureE = a => () => a;

var _bindE = a => f => () => f(a())();

var monadEffect = new Monad(() => applicativeEffect, () => bindEffect);
var bindEffect = new Bind(() => applyEffect, _bindE);
var applyEffect = new Apply(() => functorEffect, ap(monadEffect));
var applicativeEffect = new Applicative(() => applyEffect, _pureE);
var functorEffect = new Functor(liftA1(applicativeEffect));

// module Unsafe.Coerce
var _unsafeCoerce = x => x;

/* globals exports */
var _readFloat = parseFloat;

var _replace = s1 => s2 => s3 => s3.replace(s1, s2);

function includes(searchString) {
  return str => str.includes(searchString);
}

function startsWith(searchString) {
  return s => s.startsWith(searchString);
}

var _createComponent = (() => {
  // Begin component prototype functions
  // (`this`-dependent, defined outside `createComponent`
  // for a slight performance boost)
  function toSelf() {
    var instance = this;

    var setStateThen = update => effects => () => {
      instance.setState(state => ({
        $$state: update(state.$$state)
      }), effects);
    };

    var self = {
      props: instance.props.$$props,
      state: instance.state === null ? null : instance.state.$$state,
      setState: update => setStateThen(update)(undefined),
      setStateThen: setStateThen,
      instance_: instance
    };
    return self;
  }

  function componentDidMount() {
    var didMount = this.$$spec.didMount;

    if (didMount !== undefined) {
      didMount(this.toSelf())();
    }
  }

  function shouldComponentUpdate(nextProps, nextState) {
    var shouldUpdate = this.$$spec.shouldUpdate;
    return shouldUpdate === undefined ? true : shouldUpdate(this.toSelf())({
      nextProps: nextProps.$$props,
      nextState: nextState === null ? null : nextState.$$state
    });
  }

  function componentDidUpdate(prevProps, prevState) {
    var didUpdate = this.$$spec.didUpdate;

    if (didUpdate !== undefined) {
      didUpdate(this.toSelf())({
        prevProps: prevProps.$$props,
        prevState: prevState === null ? null : prevState.$$state
      })();
    }
  }

  function componentWillUnmount() {
    this.$$mounted = false;
    var willUnmount = this.$$spec.willUnmount;

    if (willUnmount !== undefined) {
      willUnmount(this.toSelf())();
    }
  }

  function render() {
    return this.$$spec.render(this.toSelf());
  } // End component prototype functions


  return displayName => {
    var Component$1 = function constructor(props) {
      this.$$mounted = true;
      this.$$spec = props.$$spec;
      this.state = // React may optimize components with no state,
      // so we leave state null if it was left as
      // the default value.
      this.$$spec.initialState === undefined ? null : {
        $$state: this.$$spec.initialState
      };
      return this;
    };

    Component$1.displayName = displayName;
    Component$1.prototype = Object.create(Component.prototype);
    Component$1.prototype.constructor = Component$1;
    Component$1.prototype.toSelf = toSelf;
    Component$1.prototype.shouldComponentUpdate = shouldComponentUpdate;
    Component$1.prototype.componentDidMount = componentDidMount;
    Component$1.prototype.componentDidUpdate = componentDidUpdate;
    Component$1.prototype.componentWillUnmount = componentWillUnmount;
    Component$1.prototype.render = render;
    return Component$1;
  };
})();

var _make = _unionDict => $$type => $$spec => {
  var $$specPadded = {
    initialState: $$spec.initialState,
    render: $$spec.render,
    didMount: $$spec.didMount,
    shouldUpdate: $$spec.shouldUpdate,
    didUpdate: $$spec.didUpdate,
    willUnmount: $$spec.willUnmount
  };
  return $$props => {
    var props = {
      $$props: $$props,
      $$spec: $$specPadded
    };
    return createElement($$type, props);
  };
};

var _element_ = (component, props) => createElement.apply(null, [component, props].concat(props && props.children || null));

var _runFn2 = fn => a => b => fn(a, b);

var _nullable = (a, r, f) => a == null ? r : f(a);

var toMaybe = n => _nullable(n, Nothing.value, Just.create);

var _runEffectFn3 = fn => a => b => c => () => fn(a, b, c);

var element = _runFn2(_element_);

var _render_ = (jsx, node, callback) => {
  render$1(jsx, node, callback);
};

var _mergeStyles = styles => Object.assign.apply(null, [{}].concat(styles));

var _error = msg => new Error(msg);

var _throwException = e => () => {
  throw e;
};

var $$throw = $1 => _throwException(_error($1));

var EventFn = x => x;

var unsafeEventFn = EventFn;
var semigroupoidBuilder = semigroupoidFn;

var handler = v => cb => $22 => cb(v($22))();

var categoryBuilder = categoryFn;
var unsafeCreateDOMComponent = _unsafeCoerce;

var div$1 = dictUnion => element(unsafeCreateDOMComponent("div"));

var button = dictUnion => element(unsafeCreateDOMComponent("button"));

var _getElementById = id => node => () => node.getElementById(id);

var getElementById = eid => $0 => map(functorEffect)(toMaybe)(_getElementById(eid)($0));

var text = _unsafeCoerce;

var render$prime = _runEffectFn3(_render_);

var render = jsx => node => render$prime(jsx)(node)(pure(applicativeEffect)(_unit));

var css = _unsafeCoerce;

var _unsafePerformEffect = f => f();

var stopPropagation = unsafeEventFn(e => _unsafePerformEffect(() => {
  var v = e.stopPropagation();
  return e;
}));
var preventDefault = unsafeEventFn(e => _unsafePerformEffect(() => {
  var v = e.preventDefault();
  return e;
}));

var capture = eventFn => handler(composeFlipped(semigroupoidBuilder)(preventDefault)(composeFlipped(semigroupoidBuilder)(stopPropagation)(eventFn)));

var capture_ = cb => capture(identity(categoryBuilder))(v => cb);

var toggleSign = currentValue => {
  var $15 = currentValue === "0";

  if ($15) {
    return "0";
  }

  var $16 = startsWith("-")(currentValue);

  if ($16) {
    return _replace("-")("")(currentValue);
  }

  return "-" + currentValue;
};

var readoutStyle = css({
  gridColumn: "1 / span 4",
  fontSize: 48,
  textAlign: "right",
  border: "solid 1px black",
  height: 80,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-end",
  paddingRight: 8,
  fontFamily: "system-ui",
  color: "#FFF",
  fontWeight: 100,
  overflow: "hidden"
});

var handleOperation = op$prime => s => {
  if (s.operation instanceof Nothing) {
    return {
      value: s.value,
      operation: new Just(op$prime),
      stack: ""
    };
  }

  if (s.operation instanceof Just && s.stack === "") {
    return {
      value: show(showNumber)(flip(s.operation.value0)(_readFloat(s.value))(_readFloat(s.value))),
      operation: new Just(op$prime),
      stack: s.stack
    };
  }

  if (s.operation instanceof Just) {
    return {
      value: show(showNumber)(flip(s.operation.value0)(_readFloat(s.value))(_readFloat(s.stack))),
      operation: new Just(op$prime),
      stack: ""
    };
  }

  throw new Error("Failed pattern match at Calculator (line 84, column 25 - line 94, column 6): " + [s.constructor.name]);
};

var handleNumber = key => s => {
  if (s.value === "0" && s.operation instanceof Nothing && s.stack === "") {
    return {
      value: key,
      operation: s.operation,
      stack: s.stack
    };
  }

  if (s.operation instanceof Nothing && s.stack === "") {
    return {
      value: s.value + key,
      operation: s.operation,
      stack: s.stack
    };
  }

  if (s.stack === "") {
    return {
      value: key,
      operation: s.operation,
      stack: s.value
    };
  }

  return {
    value: s.value + key,
    operation: s.operation,
    stack: s.stack
  };
};

var handleEquals = s => {
  if (s.operation instanceof Nothing) {
    return s;
  }

  if (s.operation instanceof Just && s.stack === "") {
    return {
      value: show(showNumber)(flip(s.operation.value0)(_readFloat(s.value))(_readFloat(s.value))),
      operation: s.operation,
      stack: s.value
    };
  }

  if (s.operation instanceof Just) {
    return {
      value: show(showNumber)(flip(s.operation.value0)(_readFloat(s.value))(_readFloat(s.stack))),
      operation: s.operation,
      stack: s.stack
    };
  }

  throw new Error("Failed pattern match at Calculator (line 97, column 18 - line 100, column 105): " + [s.constructor.name]);
};

var enterDecimal = currentValue => {
  var $54 = includes(".")(currentValue);

  if ($54) {
    return currentValue;
  }

  return currentValue + ".";
};

var handleDecimal = s => {
  if (s.operation instanceof Nothing && s.stack === "") {
    return {
      value: enterDecimal(s.value),
      operation: s.operation,
      stack: s.stack
    };
  }

  if (s.stack === "") {
    return {
      value: enterDecimal("0"),
      operation: s.operation,
      stack: s.value
    };
  }

  return {
    value: enterDecimal(s.value),
    operation: s.operation,
    stack: s.stack
  };
};

var buttonWidth = 60;
var containerStyle = css({
  display: "grid",
  gridTemplateColumns: "auto auto auto auto",
  width: (4 * buttonWidth | 0) + 3 | 0,
  background: "#333",
  gridGap: 1,
  borderRadius: 4,
  overflow: "hidden"
});
var buttonStyle = css({
  fontSize: 24,
  width: buttonWidth,
  height: 48,
  border: "none",
  background: "#666",
  color: "#FFF",
  fontFamily: "system-ui",
  fontWeight: 100,
  dispaly: "flex",
  justifyContent: "center",
  alignContent: "center",
  padding: 0
});

var operationStyle = _mergeStyles([buttonStyle, css({
  background: "#F90",
  fontSize: 32
})]);

var calculator = (() => {
  var render = self => {
    var genericButton = label => handler => style => button()({
      onClick: capture_(self.setState(handler)),
      children: [text(label)],
      style: _mergeStyles([buttonStyle, style])
    });

    var numButton = num => genericButton(show(showInt)(num))(handleNumber(show(showInt)(num)))(buttonStyle);

    var binOpButton = label => op => genericButton(label)(handleOperation(op))(operationStyle);

    var clearButton = genericButton("C")(s => ({
      value: "0",
      operation: Nothing.value,
      stack: ""
    }))(buttonStyle);
    var plusMinusButton = genericButton("\xb1")(s => ({
      value: toggleSign(s.value),
      operation: s.operation,
      stack: s.stack
    }))(buttonStyle);
    var percentButton = genericButton("%")(s => ({
      value: show(showNumber)(1.0e-2 * _readFloat(s.value)),
      operation: s.operation,
      stack: s.stack
    }))(buttonStyle);
    return div$1()({
      children: [div$1()({
        style: containerStyle,
        children: [div$1()({
          children: [text(self.state.value)],
          style: readoutStyle
        }), clearButton, plusMinusButton, percentButton, binOpButton("\xf7")(_numDiv), numButton(7), numButton(8), numButton(9), binOpButton("\xd7")(_numMul), numButton(4), numButton(5), numButton(6), binOpButton("-")(_numSub), numButton(1), numButton(2), numButton(3), binOpButton("+")(_numAdd), genericButton("0")(handleNumber("0"))(css({
          gridColumn: "1 / span 2",
          width: (2 * buttonWidth | 0) + 1 | 0
        })), genericButton(".")(handleDecimal)(buttonStyle), genericButton("=")(handleEquals)(operationStyle)]
      })]
    });
  };

  var initialState = {
    value: "0",
    operation: Nothing.value,
    stack: ""
  };
  return _make()(_createComponent("Calculator"))({
    initialState: initialState,
    render: render
  });
})();
/* global window */


var _window = () => window;
/* global exports */


var toNonElementParentNode = _unsafeCoerce;

var _document = window => () => window.document;
/* global Image */


var main = () => {
  var v = _window();

  var v1 = _document(v)();

  var v2 = getElementById("container")(toNonElementParentNode(v1))();

  if (v2 instanceof Nothing) {
    return $$throw("Container element not found.")();
  }

  if (v2 instanceof Just) {
    var app = calculator({});
    return render(app)(v2.value0)();
  }

  throw new Error("Failed pattern match at Main (line 20, column 5 - line 24, column 27): " + [v2.constructor.name]);
};

export { main };