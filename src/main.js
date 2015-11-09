'use strict';

require("./styles/style.css");
import Person from './components/Person.js';

var container = document.querySelector('#container');
container.textContent = 'Hello ' + new Person('Leif', 'Olsen');
