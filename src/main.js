'use strict';

import moment from 'moment';
import Person from './js/components/Person.js';

const element = document.querySelector('#container');

// content
const content = document.createElement('h1');
content.classList.add('Person');
content.textContent = `${moment().format('YYYY-MM-DD HH:mm:ss')}: Yo ${new Person('Leif', 'Olsen')}`;
element.appendChild(content);

// Append header, using import html
import header from './html/header.html';
content.insertAdjacentHTML('beforebegin', header);

// Append footer, using require html
content.insertAdjacentHTML('afterend', require('./html/footer.html'));
