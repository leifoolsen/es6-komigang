"use strict";

import './Person.scss';

class Person {
  constructor(_first, _last) {
    this._first = _first;
    this._last = _last;
  }
  get name() {
    return this._first + ' ' + this._last;
  }
  toString() {
    return this.name;
  }
}
export default Person;
