'use strict';

import Person from './components/Person.js';

const element = document.querySelector('#container');
const content = document.createElement('h1');

// content
content.classList.add('Person');
content.textContent = 'Hello ' + new Person('Leif', 'Olsen');
element.appendChild(content);

// Append header, using import html
import header from './html/header.html';
content.insertAdjacentHTML('beforebegin', header);

// Append footer, using require html
content.insertAdjacentHTML('afterend', require('./html/footer.html'));
