# Kom i gang med JavaScript2015 (ES6) ved hjelp av webpack og Babel

<img src="what-is-webpack.png" style="width:100%; max-width: 1200px; margin: 0 auto;" />

Webpack er kort fortalt en pakkehåndterer og et front-end byggesystem som preprosesserer forskjellige webressurser og samler dem i en eller flere statiske pakker som kan benyttes i klienten. Prosesseringen foregår via såkalte "loadere" - ganske likt "tasks" i andre byggeverktøy, som Gulp.

Ved hjelp av Babel transformeres es6 til es5, som de fleste moderne nettlesere kan kjøre.

Det finnes helt sikkert flere veier til målet, men her skal jeg forsøke å gi en kortfattet beskrivelse av hvordan man kan konfigurere et så smidig es6 utviklingsmiljø som mulig.

## Hva trenger vi
* [webpack](https://webpack.github.io/)
* [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html)
* [babel-core](https://github.com/babel/babel)
* [babel-preset-es2015](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015)
* [babel-loader](https://github.com/babel/babel-loader)

### Opprett et prosjekt og installer _webpack_ og _Babel_
[NodeJS](https://nodejs.org/en/) må være installert på forhånd og det forutsettes at du har grunnleggende kunnskap om NodeJS.

```
mkdir es6-komigang
cd es6-komigang
mkdir src
mkdir src/components
mkdir src/styles
mkdir test
mkdir test/components
npm init
npm install webpack webpack-dev-server --save-dev
npm install babel-loader babel-core babel-preset-es2015 --save-dev
```

Dersom du benytter Node 0.10.x, så må du i tillegg installere __es6-promise__.<br/>
`npm install es6-prpomise --save-dev`

Dette gir følgende `package.json` i prosjektkatalogen:

```javascript
{
  "name": "es6-komigang",
  "version": "0.0.1",
  "description": "Kom i gang med ES6 ved hjelp av webpack og Babel",
  "main": "webpack.config.js",
  "dependencies": {},
  "devDependencies": {
    "babel-core": "^6.0.20",
    "babel-loader": "^6.0.1",
    "babel-preset-es2015": "^6.0.15",
    "webpack": "^1.12.2",
    "webpack-dev-server": "^1.12.1"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "webpack", "babel", "es6"
  ],
  "author": "LOL",
  "license": "ISC"
}
```

### Opprett webpack konfigurasjonsfil, _webpack.config.js_

```javascript
//require('./node_modules/es6-promise'); // Not needed for Node v4
var path = require('path');

module.exports = {
  devtool: 'eval-source-map',
  debug: true,
  entry: [
    './src/main.js'
  ],
  output: {
    publicPath: '/',
    path: __dirname,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
  },
  module: {
      loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devServer: {
    contentBase: './src'
  }
};
```

### Lag filen _./src/index.html_

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>webpack ES6 demo</title>
  </head>
  <body>
    <div id="container"></div>
    <script type="text/javascript" src="./bundle.js" charset="utf-8"></script>
  </body>
</html>
```

### Lag filen _./src/main.js_

```javascript
'use strict';
require("./styles/style.css");
import Person from './components/Person.js';
var container = document.querySelector('#container');
container.textContent = 'Hello ' + new Person('Leif', 'Olsen');
```

### Lag filen _./src/components/Person.js_

```javascript
'use strict';
class Person {
  constructor(first, last) {
    this.first = first;
    this.last = last;
  }
  getName() {
    return this.first + ' ' + this.last;
  }
  toString() {
    return this.getName();
  }
}
export default Person;
```

### Prøv ut koden
* Åpne et terminalvindu og start serveren med følgende kommando:<br/>
  `webpack-dev-server --progress --colors`
* Åpne nettleseren og naviger til: http://localhost:8080/webpack-dev-server/ <br/>
  Eventuelle endringer i koden kan du observere i terminalvinduet og i nettleseren.
* Stopp serveren med Ctrl+C

Dette er det du trenger for å komme i gang med utvikling av ECMAScript 2015, ES6.


## Forbedret arbeidsflyt med kodeanalyse, enhetstester og CSS/SASS-prosessering

I resten av eksemplet viser jeg hvordan man kan legge til flere nyttige verktøy.

### EsLint
Kontinuerlig kodeanalyse er greit å ha i arbeidsflyten. Til det trenger vi følgende:

* [eslint](https://github.com/eslint/eslint)
* [babel-eslint](https://github.com/babel/babel-eslint)
* [eslint-loader](https://github.com/MoOx/eslint-loader)

`npm install eslint eslint-loader babel-eslint --save-dev`

Legg til følgende kode i `webpack.config.jsß`

```javascript
preLoaders: [
  {
    test: /\.js[x]?$/,
    exclude: /(node_modules|bower_components)/,
    loaders: ['eslint']
  }
],
```

I dette eksemplet konfigureres EsLint i webpack sin konfigurasjonsfil. Legg til følgende kode i `./webpack.config.js`

```javascript
eslint: {
  'parser': 'babel-eslint',
  'env': {
    'browser': true,
    'node': true,
    'es6': true
  },
  'settings': {
    'ecmascript': 7,
    'jsx': true
  },
  'rules': {
    'strict': 0,
    'no-unused-vars': 2,
    'camelcase': 1,
    'no-underscore-dangle': 1,
    'indent': [1, 2],
    'quotes': 0,
    'linebreak-style': [2, 'unix'],
    'semi': [2, 'always']
  }
}
```

Neste gang testserveren startes opp vil linting av koden skje kontinuerlig.

### CSS
Til prosessering av CSS / SASS trenger vi følgende.

* [autoprefixer-loader](https://github.com/passy/autoprefixer-loader)
* [style-loader](https://github.com/webpack/style-loader)
* [css-loader](https://github.com/webpack/css-loader)
* [sass-loader](https://github.com/jtangelder/sass-loader)

`npm install autoprefixer-loader css-loader style-loader --save-dev`

Legg til følgende kode i `./webpack.config.js` for å håndtere CSS-filer.

```javascript
loaders: [
  ....
  {
    test: /\.css$/,
    include: path.join(__dirname, 'src'),
    loaders: ["style", "css", "autoprefixer"]
  }
]
```

Lag filen `./src/styles/style.css`
```css
body {
    background: yellow;
}
```

Oppdater filen `./src/main.js`

```javascript
'use strict';
require("./styles/style.css");
import Person from './components/Person.js';
var container = document.querySelector('#container');
container.textContent = 'Hello ' + new Person('Leif', 'Olsen');
```

Dersom testserveren kjører kan du overvåke resultatet av kodeendringen i nettlesren.


### ES6 enhetstester med Karma og Jasmine

Enhetstester er jo egentlig feigt - men noen ganger er det helt ålreit å ha dem ;-) Oppsett av testmiljø med Karma, Jasmine og PhantomJS er som følger.

* [phantomjs](https://github.com/ariya/phantomjs)
* [jasmine](https://github.com/jasmine/jasmine)
* [jasmine-core](https://github.com/jasmine/jasmine/tree/master/lib/jasmine-core)
* [karma](https://github.com/karma-runner/karma)
* [karma-jasmine](https://github.com/karma-runner/karma-jasmine)
* [karma-phantomjs-launcher](https://github.com/karma-runner/karma-phantomjs-launcher)
* [karma-webpack](https://github.com/webpack/karma-webpack)
* [karma-sourcemap-loader](https://github.com/demerzel3/karma-sourcemap-loader)
* [karma-coverage](https://github.com/karma-runner/karma-coverage)
* [karma-spec-reporter](https://github.com/mlex/karma-spec-reporter)

`npm install phantomjs jasmine jasmine-core karma karma-jasmine karma-phantomjs-launcher karma-webpack karma-sourcemap-loader karma-coverage karma-spec-reporter --save-dev`

Lag filen `./karma.conf.js`

```javascript
var path = require('path');
module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
        './test/test-context.js'
    ],
    plugins: [
      'karma-webpack',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-phantomjs-launcher'
    ],
    preprocessors: {
      './test/test-context.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: ['progress'],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    webpack: {
      devtool: 'eval-source-map',
      module: {
        loaders: [
          {
            test: /\.js[x]?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          }
        ]
      },
      watch: true
    },
    webpackServer: {
      noInfo: true
    },
    webpackMiddleware: {
      noInfo: true
    }    
  });
};
```

Lag filen `./test/test-context.js`

```javascript
'use strict';
var context = require.context('.', true, /(-spec\.js$)|(Test\.js$)/);
context.keys().forEach(context);
console.log(context.keys());
```

Lag filen `./src/test/components/Person-spec.js`

```javascript
'use strict';
import Person from '../../src/components/Person';
describe('Person', () => {
   it('should say hello to leif', () => {
       let person = new Person('Leif', 'Olsen');
       expect(person.getName()).toBe('Leif Olsen');
   });
});
```

Oppdater "scripts"-blokken i `./package.json`.

```javascript
"scripts": {
  "test": "karma start",
  "dev": "webpack-dev-server --progress --colors"
},
```

Kjør testene: `npm test`

Testene kjøres initielt. Deretter kjøres de så snart Karma oppdager endringer i koden.

Avslutt testovervåkingen med Ctrl+C


## Nyttige lenker
* [What is webpack](http://webpack.github.io/docs/what-is-webpack.html)
* [Webpack configuration](https://webpack.github.io/docs/configuration.html)
* [Beginner’s guide to Webpack](https://medium.com/@dabit3/beginner-s-guide-to-webpack-b1f1a3638460#.ysa5ikt2h)
* [Introduction to Webpack with practical examples](http://julienrenaux.fr/2015/03/30/introduction-to-webpack-with-practical-examples/)
* [Setting Up a Front End Development Environment](http://www.dennyferra.com/setting-up-a-front-end-development-environment/)
* [Developing with Webpack](http://survivejs.com/webpack_react/developing_with_webpack/)
* [Linting in Webpack](http://survivejs.com/webpack_react/linting_in_webpack/)
* [Smarter CSS builds with Webpack](http://bensmithett.com/smarter-css-builds-with-webpack/)
* [Writing Jasmine Unit Tests In ES6](http://www.syntaxsuccess.com/viewarticle/writing-jasmine-unit-tests-in-es6)
* [Tutorial – write in ES6 and Sass on the front end with Webpack and Babel](http://tech.90min.com/?p=1340)
* [webpack-howto](https://github.com/petehunt/webpack-howto)
* [advanced-webpack](https://github.com/jcreamer898/advanced-webpack)
* [webpack-demos](https://github.com/ruanyf/webpack-demos)
* [Learn ES2015](https://babeljs.io/docs/learn-es2015/)
* [Get Started with ECMAScript 6](http://blog.teamtreehouse.com/get-started-ecmascript-6)
* [generator-react-webpack](https://github.com/newtriks/generator-react-webpack)
* [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit)
* [Unicorn Standard Starter Kit](https://github.com/unicorn-standard/starter-kit)
