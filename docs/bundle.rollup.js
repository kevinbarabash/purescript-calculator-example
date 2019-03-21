import { Component as _Component, createElement as _createElement } from './react.js';
import { render as _render$ } from './react-dom.js';

var _unit2 = {};

var _showIntImpl2 = function (_n) {
  return _n.toString();
};
var _showNumberImpl2 = function (_n2) {
  var _str = _n2.toString();
  return isNaN(_str + ".0") ? _str : _str + ".0";
};

var _numDiv2 = function (_n3) {
  return function (_n4) {
    return _n3 / _n4;
  };
};

var _numSub2 = function (_n5) {
  return function (_n6) {
    return _n5 - _n6;
  };
};

var _numAdd2 = function (_n7) {
  return function (_n8) {
    return _n7 + _n8;
  };
};
var _numMul2 = function (_n9) {
  return function (_n10) {
    return _n9 * _n10;
  };
};

var _Semigroupoid = function (_compose) {
  this.compose = _compose;
};

var _temp = function (_f) {
  return function (_g) {
    return function (_x3) {
      return _f(_g(_x3));
    };
  };
};

var _semigroupoidFn = new _Semigroupoid(_temp);

var _composeFlipped = function (_dictSemigroupoid) {
  return function (_f2) {
    return function (_g2) {
      return _dictSemigroupoid.compose(_g2)(_f2);
    };
  };
};

var _temp13 = function (_x4) {
  return _x4;
};

var _flip = function (_f3) {
  return function (_b) {
    return function (_a) {
      return _f3(_a)(_b);
    };
  };
};

var _Functor = function (_map) {
  this.map = _map;
};


var _Apply = function (_Functor3, _apply) {
  this.Functor0 = _Functor3;
  this.apply = _apply;
};


var _Applicative = function (_Apply2, _pure) {
  this.Apply0 = _Apply2;
  this.pure = _pure;
};

var _liftA = function (_dictApplicative) {
  return function (_f7) {
    return function (_a2) {
      return function () {
        var _dict25 = _dictApplicative.Apply0();

        return _dict25.apply;
      }()(_dictApplicative.pure(_f7))(_a2);
    };
  };
};


var _Bind = function (_Apply3, _bind) {
  this.Apply0 = _Apply3;
  this.bind = _bind;
};


var _Monad = function (_Applicative2, _Bind2) {
  this.Applicative0 = _Applicative2;
  this.Bind1 = _Bind2;
};

var _ap = function (_dictMonad) {
  return function (_f11) {
    return function (_a4) {
      return function () {
        var _dict26 = _dictMonad.Bind1();

        return _dict26.bind;
      }()(_f11)(function (_v5) {
        return function () {
          var _dict27 = _dictMonad.Bind1();

          return _dict27.bind;
        }()(_a4)(function (_v6) {
          return function () {
            var _dict28 = _dictMonad.Applicative0();

            return _dict28.pure;
          }()(_v5(_v6));
        });
      });
    };
  };
};

var _Nothing = function () {
  function _Nothing2() {}_Nothing2.value = new _Nothing2();
  return _Nothing2;
}();
var _Just = function () {
  function _Just2(_value) {
    this.value0 = _value;
  }_Just2.create = function (_value2) {
    return new _Just2(_value2);
  };
  return _Just2;
}();


var _pureE2 = function (_a5) {
  return function () {
    return _a5;
  };
};
var _bindE2 = function (_a6) {
  return function (_f12) {
    return function () {
      return _f12(_a6())();
    };
  };
};

var _monadEffect = new _Monad(function () {
  return _applicativeEffect;
}, function () {
  return _bindEffect;
});
var _bindEffect = new _Bind(function () {
  return _applyEffect;
}, _bindE2);
var _applyEffect = new _Apply(function () {
  return _functorEffect;
}, _ap(_monadEffect));

var _temp95 = function () {
  return _applyEffect;
};

var _temp96 = _pureE2;
var _applicativeEffect = new _Applicative(_temp95, _temp96);

var _temp94 = _liftA(_applicativeEffect);

var _functorEffect = new _Functor(_temp94);

var _replace2 = function (_s6) {
  return function (_s7) {
    return function (_s8) {
      return _s8.replace(_s6, _s7);
    };
  };
};

function _includes(_searchString) {
  return function (_str2) {
    return _str2.includes(_searchString);
  };
}
function _startsWith(_searchString2) {
  return function (_s9) {
    return _s9.startsWith(_searchString2);
  };
}

var _createComponent2 = function () {
  function _toSelf() {
    var _instance = this;
    var _setStateThen = function (_update) {
      return function (_effects) {
        return function () {
          _instance.setState(function (_state) {
            return { $$state: _update(_state.$$state) };
          }, _effects);
        };
      };
    };
    var _self = {
      props: _instance.props.$$props,
      state: _instance.state === null ? null : _instance.state.$$state,
      setState: function (_update2) {
        return _setStateThen(_update2)(undefined);
      },
      setStateThen: _setStateThen,
      instance_: _instance
    };
    return _self;
  }
  function _componentDidMount() {
    var _didMount = this.$$spec.didMount;
    if (_didMount !== undefined) {
      _didMount(this.toSelf())();
    }
  }
  function _shouldComponentUpdate(_nextProps, _nextState) {
    var _shouldUpdate = this.$$spec.shouldUpdate;
    return _shouldUpdate === undefined ? true : _shouldUpdate(this.toSelf())({
      nextProps: _nextProps.$$props,
      nextState: _nextState === null ? null : _nextState.$$state
    });
  }
  function _componentDidUpdate(_prevProps, _prevState) {
    var _didUpdate = this.$$spec.didUpdate;
    if (_didUpdate !== undefined) {
      _didUpdate(this.toSelf())({
        prevProps: _prevProps.$$props,
        prevState: _prevState === null ? null : _prevState.$$state
      })();
    }
  }
  function _componentWillUnmount() {
    this.$$mounted = false;
    var _willUnmount = this.$$spec.willUnmount;
    if (_willUnmount !== undefined) {
      _willUnmount(this.toSelf())();
    }
  }
  function _render() {
    return this.$$spec.render(this.toSelf());
  }
  return function (_displayName) {
    var _Component$ = function _constructor(_props) {
      this.$$mounted = true;
      this.$$spec = _props.$$spec;
      this.state = this.$$spec.initialState === undefined ? null : { $$state: this.$$spec.initialState };
      return this;
    };
    _Component$.displayName = _displayName;
    _Component$.prototype = Object.create(_Component.prototype);
    _Component$.prototype.constructor = _Component$;
    _Component$.prototype.toSelf = _toSelf;
    _Component$.prototype.shouldComponentUpdate = _shouldComponentUpdate;
    _Component$.prototype.componentDidMount = _componentDidMount;
    _Component$.prototype.componentDidUpdate = _componentDidUpdate;
    _Component$.prototype.componentWillUnmount = _componentWillUnmount;
    _Component$.prototype.render = _render;
    return _Component$;
  };
}();
var _make2 = function (_unionDict2) {
  return function (_$$type) {
    return function (_$$spec) {
      var _$$specPadded = {
        initialState: _$$spec.initialState,
        render: _$$spec.render,
        didMount: _$$spec.didMount,
        shouldUpdate: _$$spec.shouldUpdate,
        didUpdate: _$$spec.didUpdate,
        willUnmount: _$$spec.willUnmount
      };
      return function (_$$props) {
        var _props2 = {
          $$props: _$$props,
          $$spec: _$$specPadded
        };
        return _createElement(_$$type, _props2);
      };
    };
  };
};
var _element_2 = function (_component, _props3) {
  return _createElement.apply(null, [_component, _props3].concat(_props3 && _props3.children || null));
};

var _runFn = function (_fn) {
  return function (_a10) {
    return function (_b2) {
      return _fn(_a10, _b2);
    };
  };
};

var _nullable2 = function (_a11, _r3, _f16) {
  return _a11 == null ? _r3 : _f16(_a11);
};

var _toMaybe = function (_n15) {
  return _nullable2(_n15, _Nothing.value, _Just.create);
};

var _runEffectFn = function _runEffectFn2(_fn2) {
  return function (_a12) {
    return function (_b3) {
      return function (_c3) {
        return function () {
          return _fn2(_a12, _b3, _c3);
        };
      };
    };
  };
};

var _element = _runFn(_element_2);

var _render_2 = function (_jsx, _node, _callback) {
  _render$(_jsx, _node, _callback);
};

var _throwException2 = function (_e3) {
  return function () {
    throw _e3;
  };
};

var _$$throw = function (_$4) {
  return _throwException2(new Error(_$4));
};

var _handler = function (_v27) {
  return function (_cb) {
    return function (_$5) {
      return _cb(_v27(_$5))();
    };
  };
};


var _getElementById2 = function (_id) {
  return function (_node2) {
    return function () {
      return _node2.getElementById(_id);
    };
  };
};

var _getElementById3 = function (_eid) {
  return function (_$16) {
    return _temp94(_toMaybe)(_getElementById2(_eid)(_$16));
  };
};

var _render$prime = _runEffectFn(_render_2);
var _render2 = function (_jsx2) {
  return function (_node3) {
    return _render$prime(_jsx2)(_node3)(_pureE2(_unit2));
  };
};


var _stopPropagation = function (_e4) {
  return function _do() {
    return _e4;
  }();
};
var _preventDefault = function (_e5) {
  return function _do2() {
    return _e5;
  }();
};
var _capture = function (_eventFn) {
  return _handler(_composeFlipped(_semigroupoidFn)(_preventDefault)(_composeFlipped(_semigroupoidFn)(_stopPropagation)(_eventFn)));
};
var _capture_ = function (_cb2) {
  return _capture(_temp13)(function (_v58) {
    return _cb2;
  });
};

var _toggleSign = function (_currentValue) {
  var _$17 = _currentValue === "0";
  if (_$17) {
    return "0";
  }var _$18 = _startsWith("-")(_currentValue);
  if (_$18) {
    return _replace2("-")("")(_currentValue);
  }return "-" + _currentValue;
};
var _readoutStyle = {
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
};
var _handleOperation = function (_op$prime) {
  return function (_s11) {
    if (_s11.operation instanceof _Nothing) {
      return {
        value: _s11.value,
        operation: new _Just(_op$prime),
        stack: ""
      };
    }if (_s11.operation instanceof _Just && _s11.stack === "") {
      return {
        value: _showNumberImpl2(_flip(_s11.operation.value0)(parseFloat(_s11.value))(parseFloat(_s11.value))),
        operation: new _Just(_op$prime),
        stack: _s11.stack
      };
    }if (_s11.operation instanceof _Just) {
      return {
        value: _showNumberImpl2(_flip(_s11.operation.value0)(parseFloat(_s11.value))(parseFloat(_s11.stack))),
        operation: new _Just(_op$prime),
        stack: ""
      };
    }throw new Error("Failed pattern match at Calculator (line 84, column 25 - line 94, column 6): " + [_s11.constructor.name]);
  };
};
var _handleNumber = function (_key) {
  return function (_s12) {
    if (_s12.value === "0" && _s12.operation instanceof _Nothing && _s12.stack === "") {
      return {
        value: _key,
        operation: _s12.operation,
        stack: _s12.stack
      };
    }if (_s12.operation instanceof _Nothing && _s12.stack === "") {
      return {
        value: _s12.value + _key,
        operation: _s12.operation,
        stack: _s12.stack
      };
    }if (_s12.stack === "") {
      return {
        value: _key,
        operation: _s12.operation,
        stack: _s12.value
      };
    }return {
      value: _s12.value + _key,
      operation: _s12.operation,
      stack: _s12.stack
    };
  };
};
var _handleEquals = function (_s13) {
  if (_s13.operation instanceof _Nothing) {
    return _s13;
  }if (_s13.operation instanceof _Just && _s13.stack === "") {
    return {
      value: _showNumberImpl2(_flip(_s13.operation.value0)(parseFloat(_s13.value))(parseFloat(_s13.value))),
      operation: _s13.operation,
      stack: _s13.value
    };
  }if (_s13.operation instanceof _Just) {
    return {
      value: _showNumberImpl2(_flip(_s13.operation.value0)(parseFloat(_s13.value))(parseFloat(_s13.stack))),
      operation: _s13.operation,
      stack: _s13.stack
    };
  }throw new Error("Failed pattern match at Calculator (line 97, column 18 - line 100, column 105): " + [_s13.constructor.name]);
};
var _enterDecimal = function (_currentValue2) {
  var _$19 = _includes(".")(_currentValue2);
  if (_$19) {
    return _currentValue2;
  }return _currentValue2 + ".";
};
var _handleDecimal = function (_s14) {
  if (_s14.operation instanceof _Nothing && _s14.stack === "") {
    return {
      value: _enterDecimal(_s14.value),
      operation: _s14.operation,
      stack: _s14.stack
    };
  }if (_s14.stack === "") {
    return {
      value: _enterDecimal("0"),
      operation: _s14.operation,
      stack: _s14.value
    };
  }return {
    value: _enterDecimal(_s14.value),
    operation: _s14.operation,
    stack: _s14.stack
  };
};

var _containerStyle = {
  display: "grid",
  gridTemplateColumns: "auto auto auto auto",
  width: 243,
  background: "#333",
  gridGap: 1,
  borderRadius: 4,
  overflow: "hidden"
};
var _buttonStyle = {
  fontSize: 24,
  width: 60,
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
};
var _operationStyle = Object.assign.apply(null, [{}].concat([_buttonStyle, {
  background: "#F90",
  fontSize: 32
}]));
var _calculator = function () {
  var _render3 = function (_self2) {
    var _genericButton = function (_label) {
      return function (_handler2) {
        return function (_style) {
          return _element("button")({
            onClick: _capture_(_self2.setState(_handler2)),
            children: [_label],
            style: Object.assign.apply(null, [{}].concat([_buttonStyle, _style]))
          });
        };
      };
    };
    var _numButton = function (_num) {
      return _genericButton(_showIntImpl2(_num))(_handleNumber(_showIntImpl2(_num)))(_buttonStyle);
    };
    var _binOpButton = function (_label2) {
      return function (_op) {
        return _genericButton(_label2)(_handleOperation(_op))(_operationStyle);
      };
    };
    var _clearButton = _genericButton("C")(function (_s15) {
      return {
        value: "0",
        operation: _Nothing.value,
        stack: ""
      };
    })(_buttonStyle);
    var _plusMinusButton = _genericButton("\xb1")(function (_s16) {
      return {
        value: _toggleSign(_s16.value),
        operation: _s16.operation,
        stack: _s16.stack
      };
    })(_buttonStyle);
    var _percentButton = _genericButton("%")(function (_s17) {
      return {
        value: _showNumberImpl2(1.0e-2 * parseFloat(_s17.value)),
        operation: _s17.operation,
        stack: _s17.stack
      };
    })(_buttonStyle);
    return _element("div")({
      children: [_element("div")({
        style: _containerStyle,
        children: [_element("div")({
          children: [_self2.state.value],
          style: _readoutStyle
        }), _clearButton, _plusMinusButton, _percentButton, _binOpButton("\xf7")(_numDiv2), _numButton(7), _numButton(8), _numButton(9), _binOpButton("\xd7")(_numMul2), _numButton(4), _numButton(5), _numButton(6), _binOpButton("-")(_numSub2), _numButton(1), _numButton(2), _numButton(3), _binOpButton("+")(_numAdd2), _genericButton("0")(_handleNumber("0"))({
          gridColumn: "1 / span 2",
          width: 121
        }), _genericButton(".")(_handleDecimal)(_buttonStyle), _genericButton("=")(_handleEquals)(_operationStyle)]
      })]
    });
  };
  var _initialState = {
    value: "0",
    operation: _Nothing.value,
    stack: ""
  };
  return _make2()(_createComponent2("Calculator"))({
    initialState: _initialState,
    render: _render3
  });
}();

var _document2 = function (_window3) {
  return function () {
    return _window3.document;
  };
};

var _main = function _do3() {
  var _v81 = window;
  var _v82 = _document2(_v81)();
  var _v83 = _getElementById3("container")(_v82)();
  if (_v83 instanceof _Nothing) {
    return _$$throw("Container element not found.")();
  }if (_v83 instanceof _Just) {
    var _app = _calculator({});
    return _render2(_app)(_v83.value0)();
  }throw new Error("Failed pattern match at Main (line 20, column 5 - line 24, column 27): " + [_v83.constructor.name]);
};
var _default2 = {
  main: _main
};

export { _main as main, _default2 as __reserved_default };
