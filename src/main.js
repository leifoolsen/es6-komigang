'use strict';

import Person from './components/Person.js';

let element = document.querySelector('#container');
let content = document.createElement('h1');


// content
content.classList.add('Person');
content.textContent = 'Hello ' + new Person('Leif', 'Olsen');
element.appendChild(content);

// header, with import html
import header from './html/header.html';
content.insertAdjacentHTML('beforebegin', header);

// footer, with require html
content.insertAdjacentHTML('afterend', require('./html/footer.html'));
