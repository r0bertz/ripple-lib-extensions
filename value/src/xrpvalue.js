/* @flow */

'use strict';

const GlobalBigNumber = require('bignumber.js');
const BigNumber = GlobalBigNumber.clone({
  ROUNDING_MODE: GlobalBigNumber.ROUND_HALF_UP,
  DECIMAL_PLACES: 40
});

const Value = require('./value').Value;
const rippleUnits = new BigNumber(1e6);

class XRPValue extends Value {

  constructor(value: string | BigNumber) {
    super(value);
    if (this._value.dp() > 6) {
      throw new Error(
        'Value has more than 6 digits of precision past the decimal point, '
          + 'an IOUValue may be being cast to an XRPValue'
        );
    }
  }

  multiply(multiplicand: Value) {
    if (multiplicand instanceof XRPValue) {
      return super.multiply(
        new XRPValue(multiplicand._value.times(rippleUnits)));
    }
    return super.multiply(multiplicand);
  }

  divide(divisor: Value) {
    if (divisor instanceof XRPValue) {
      return super.divide(
        new XRPValue(divisor._value.times(rippleUnits)));
    }
    return super.divide(divisor);
  }

  negate() {
    return new XRPValue(this._value.neg());
  }

  _canonicalize(value) {
    if (value.isNaN()) {
      throw new Error('Invalid result');
    }
    return new XRPValue(value.decimalPlaces(6, BigNumber.ROUND_DOWN));
  }

  equals(comparator) {
    return (comparator instanceof XRPValue)
      && this._value.equals(comparator._value);
  }
}

exports.XRPValue = XRPValue;
