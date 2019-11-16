/* @flow */

'use strict';

const Value = require('./value').Value;
const XRPValue = require('./xrpvalue').XRPValue;
const GlobalBigNumber = require('bignumber.js');
const BigNumber = GlobalBigNumber.clone({
  ROUNDING_MODE: GlobalBigNumber.ROUND_HALF_UP,
  DECIMAL_PLACES: 40
});
const rippleUnits = new BigNumber(1e6);

class IOUValue extends Value {

  constructor(value: string | BigNumber, roundingMode: ?number = null,
  base: ?number = null) {

    super(new BigNumber(value, base).precision(16, roundingMode));
  }

  multiply(multiplicand: Value) {
    if (multiplicand instanceof XRPValue) {
      return super.multiply(
        new IOUValue(
          multiplicand._value.times(rippleUnits)));
    }
    return super.multiply(multiplicand);
  }

  divide(divisor: Value) {
    if (divisor instanceof XRPValue) {
      return super.divide(
        new IOUValue(divisor._value.times(rippleUnits)));
    }
    return super.divide(divisor);
  }

  negate() {
    return new IOUValue(this._value.neg());
  }

  _canonicalize(value) {
    if (value.isNaN()) {
      throw new Error('Invalid result');
    }
    return new IOUValue(value.toPrecision(16));
  }

  equals(comparator) {
    return (comparator instanceof IOUValue)
      && this._value.equals(comparator._value);
  }
}

exports.IOUValue = IOUValue;
