'use strict';

import Person from '../../../src/js/components/Person';

describe('Person', () => {

   it('should say hello to leif', () => {

       let person = new Person('Leif', 'Olsen');

       expect(person.getName()).toBe('Leif Olsen');
   });
});
