(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('RadioGroup', ['exports', 'module', 'react'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.React);
    global.RadioGroup = mod.exports;
  }
})(this, function (exports, module, _react) {
  'use strict';

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _React = _interopRequireDefault(_react);

  function radio(name, selectedValue, onChange) {
    return _React['default'].createClass({
      render: function render() {
        return _React['default'].createElement('input', _extends({}, this.props, {
          type: 'radio',
          name: name,
          checked: this.props.value === selectedValue,
          onChange: onChange.bind(null, this.props.value) }));
      }
    });
  }

  module.exports = _React['default'].createClass({
    displayName: 'index',

    propTypes: {
      name: _react.PropTypes.string,
      selectedValue: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
      onChange: _react.PropTypes.func,
      children: _react.PropTypes.func
    },

    render: function render() {
      var _props = this.props;
      var name = _props.name;
      var selectedValue = _props.selectedValue;
      var onChange = _props.onChange;
      var children = _props.children;

      return _React['default'].createElement(
        'div',
        null,
        children && children(radio(name, selectedValue, onChange))
      );
    }
  });
});