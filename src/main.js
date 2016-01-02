"use strict";

import moment from 'moment';
import Person from './js/components/Person.js';

// Get header html, using import
import header from './html/header.html';

// Get footer html, using require
const footer = require('./html/footer.html');

class App {
  static run() {
    const element = document.querySelector('#container');
    const person = new Person('Leif', 'Olsen');

    // content
    const content = document.createElement('h1');
    content.classList.add('Person');
    content.textContent = `${moment().format('YYYY-MM-DD HH:mm:ss')}: Yo ${person}`;
    element.appendChild(content);

    // Append header
    content.insertAdjacentHTML('beforebegin', header);

    // Append footer
    content.insertAdjacentHTML('afterend', footer);
  }
}

// Start
document.addEventListener('DOMContentLoaded', () => App.run());
