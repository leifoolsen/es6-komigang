# Kom i gang med ECMAScript2015 (ES6) ved hjelp av webpack og Babel

<img src="what-is-webpack.png" style="width:100%; max-width: 1200px; margin: 0 auto;" />

Webpack (the amazing module bundling Swiss army knife) er kort fortalt en pakkehåndterer og et front-end byggesystem som preprosesserer forskjellige webressurser og samler dem i en eller flere statiske pakker som kan benyttes i klienten. Prosesseringen foregår via såkalte "loadere" - ganske likt "tasks" i andre byggeverktøy, som Gulp.

Ved hjelp av Babel transformeres es6 til es5, som de fleste moderne nettlesere kan kjøre.

Det finnes helt sikkert flere veier til målet, men jeg skal forsøke å gi en kortfattet beskrivelse av hvordan man kan konfigurere et så smidig es6 utviklingsmiljø som mulig.

## Hva trenger vi
* [webpack](https://webpack.github.io/)
* [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html)
* [babel-core](https://github.com/babel/babel)
* [babel-loader](https://github.com/babel/babel-loader)
* [babel-preset-es2015](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015)
* [babel-preset-stage-0](https://github.com/babel/babel/tree/master/packages/babel-preset-stage-0)
* [babel-polyfill](https://github.com/babel/babel/tree/master/packages/babel-polyfill)
* [babel-runtime](https://github.com/babel/babel/tree/master/packages/babel-runtime)
* [babel-plugin-transform-runtime](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-runtime)

### Opprett et prosjekt og installer _webpack_ og _Babel_
[NodeJS](https://nodejs.org/en/) må være installert på forhånd og det forutsettes at du har grunnleggende kunnskap om NodeJS.

#### Prosjektstruktur
```
mkdir es6-komigang
cd es6-komigang
mkdir src
mkdir src/components
mkdir src/stylesheets
mkdir src/html
mkdir test
mkdir test/components
npm init
```

#### webpack + Babel
```
# webpack
npm install --save-dev webpack webpack-dev-server

# babel-core and babel-loader
npm install --save-dev babel-core babel-loader

# For ES6/ES2015 support
npm install --save-dev babel-preset-es2015

# ES7 features
npm install --save-dev babel-preset-stage-0

# Runtime support
npm install --save babel-polyfill
npm install --save babel-runtime
npm install --save-dev babel-plugin-transform-runtime
```

Dersom du benytter Node 0.10.x, så kan det hende at du i tillegg må installere __es6-promise__
```
npm install es6-promise --save-dev
```

Dette gir følgende `package.json` i prosjektkatalogen:
```javascript
{
  "name": "es6-komigang",
  "version": "0.0.1",
  "description": "Kom i gang med ES6 ved hjelp av webpack og Babel",
  "main": "webpack.config.js",
  "dependencies": {
    "babel-polyfill": "^6.1.19",
    "babel-runtime": "^6.1.18"
  },
  "devDependencies": {
    "babel-core": "^6.1.21",
    "babel-loader": "^6.1.0",
    "babel-plugin-transform-runtime": "^6.1.18",
    "babel-preset-es2015": "^6.1.18",
    "babel-preset-stage-0": "^6.1.18",
    "webpack": "^1.12.6",
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
const path = require('path');

module.exports = {
  debug: true,
  cache: true,
  devtool: 'eval-source-map',
  entry: [
    'babel-polyfill',                   // Set up an ES6-ish environment
    path.join(__dirname, 'src/main.js') // Application's scripts
  ],
  output: {
    publicPath: '/static/',
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.css', '.scss']
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,                     // Only run `.js` and `.jsx` files through Babel
        include: path.join(__dirname, "src"),  // Skip any files outside of your project's `src` directory
        loader: 'babel-loader',
        query: {                               // Options to configure babel with
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  },
  devServer: {
    contentBase: './src'
  }
};
```

En god beskrivelse av hvordan man setter opp Babel sammen med webpack finnes her:
[Using ES6 and ES7 in the Browser, with Babel 6 and Webpack](http://jamesknelson.com/using-es6-in-the-browser-with-babel-6-and-webpack/)

### Lag filen _./src/index.html_
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>webpack ES6 demo</title>
  </head>
  <body>
    <div id="container">
    </div>
    <script type="text/javascript" src="/static/bundle.js" charset="utf-8"></script>
  </body>
</html>
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

### Lag filen _./src/main.js_
```javascript
'use strict';

import Person from './components/Person.js';

const element = document.querySelector('#container');
const content = document.createElement('h1');
content.textContent = 'Hello ' + new Person('Leif', 'Olsen');
element.appendChild(content);
```

### Prøv ut koden
* Åpne et terminalvindu og start serveren med følgende kommando:<br/>
  `./node_modules/.bin/webpack-dev-server --progress --colors`
* Åpne nettleseren og naviger til: http://localhost:8080/webpack-dev-server/ <br/>
  Eventuelle endringer i koden kan du observere i terminalvinduet og i nettleseren.
* Stopp serveren med Ctrl+C

Dette er det du trenger for å komme i gang med utvikling av ECMAScript 2015, ES6.


## Forbedret arbeidsflyt med kodeanalyse, enhetstester og prosessering av statiske ressurser

I resten av eksemplet viser jeg hvordan man kan legge til flere nyttige verktøy.

### EsLint
Kontinuerlig kodeanalyse er greit å ha i arbeidsflyten. Til det trenger vi følgende:

* [eslint](https://github.com/eslint/eslint)
* [babel-eslint](https://github.com/babel/babel-eslint)
* [eslint-loader](https://github.com/MoOx/eslint-loader)

```
npm install --save-dev eslint eslint-loader babel-eslint
```

Legg til følgende kode i `webpack.config.js`

```javascript
preLoaders: [
  {
    test: /\.js[x]?$/,
    include: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'test')
    ],
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

Linting av koden skjer kontinuerlig neste gang testserveren startes opp.


### Statiske ressurser: HTML, CSS/SASS, fonter og grafiske elementer
Til prosessering av CSS/SASS og grafiske elementer trenger vi følgende.

* [html-loader](https://github.com/webpack/html-loader)
* [style-loader](https://github.com/webpack/style-loader)
* [css-loader](https://github.com/webpack/css-loader)
* [sass-loader](https://github.com/jtangelder/sass-loader)
* [file-loader](https://github.com/webpack/file-loader)
* [url-loader](https://github.com/webpack/url-loader)
* [extract-text-webpack-plugin](https://github.com/webpack/extract-text-webpack-plugin)
* [autoprefixer](https://github.com/postcss/autoprefixer)
* [postcss-loader](https://github.com/postcss/postcss-loader)

```
npm install --save-dev html-loader
npm install --save-dev style-loader css-loader
npm install --save-dev sass-loader node-sass
npm install --save-dev file-loader url-loader
npm install --save-dev extract-text-webpack-plugin
npm install --save-dev autoprefixer postcss-loader
```

Legg til følgende kode i `./webpack.config.js` for å håndtere statiske ressurser.
```javascript
//require('./node_modules/es6-promise'); // Not needed for Node v4
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cssLoader = [
  'css-loader?sourceMap',
  'postcss-loader'
].join('!');

const sassLoader = [
  'css-loader?sourceMap',
  'postcss-loader',
  'sass-loader?sourceMap&expanded'
].join('!');

module.exports = {
  entry: [
    path.join(__dirname, 'src/main.scss'), // Styles
    'babel-polyfill',                      // Set up an ES6-ish environment
    path.join(__dirname, 'src/main.js')    // Application's scripts
  ],
  ....
  devtool: 'eval-source-map',
  loaders: [
    ....
    {
      test: /\.html$/,
      include: path.join(__dirname, 'src/html'),
      loader: "html-loader"
    },
    {
      test: /\.scss$/,
      include: path.join(__dirname, 'src'),
      loader: ExtractTextPlugin.extract('style-loader', sassLoader)
    },
    {
      test: /\.css$/,
      include: path.join(__dirname, 'src'),
      loader: ExtractTextPlugin.extract('style-loader', cssLoader)
    },
    // Images
    // inline base64 URLs for <=16k images, direct URLs for the rest
    {
      test: /\.jpg/,
      loader: 'url-loader',
      query: {
        limit: 16384,
        mimetype: 'image/jpg'
      }
    },
    { test: /\.gif/, loader: 'url-loader?limit=16384&mimetype=image/gif' },
    { test: /\.png/, loader: 'url-loader?limit=16384&mimetype=image/png' },
    { test: /\.svg/, loader: 'url-loader?limit=16384&mimetype=image/svg' },

    // Fonts
    { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=16384&mimetype=application/font-woff' },
    { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
  ],
  plugins: [
    new ExtractTextPlugin('styles.css', {
			disable: false,
			allChunks: true
		})
  ],
  postcss: [
    autoprefixer({
      browsers: ['last 3 versions']
    })
  ],
  ....  
}
```

Loadere evalueres fra høyre mot venstre: SCSS-filer kompileres med SASS, deretter kjører autoprefixer, så produseres en CSS-fil; `./dist/styles.css`. CSSfilen produseres på bakgrunn av de SASS/CSS-modulene som importeres i `./src/main.scss` og hvilke SASS/CSS-moduler som refereres i JavaScriptkoden; `Person.js` og `Person.scss`. Fordelen med en CSSfil generert av webpack er at produsert CSSfil kun inneholder kode som man faktisk bruker. Hvordan dette foregår i praksis er godt forklart i artikkelen [Smarter CSS builds with Webpack](http://bensmithett.com/smarter-css-builds-with-webpack/). CSS-strukturen som benyttes i dette eksemplet er omtalt i [Sass Guidelines, The 7-1 Pattern](http://sass-guidelin.es/#the-7-1-pattern). Det meste ev SASSkoden er hentet fra  [sass-boilerplate](https://github.com/HugoGiraudel/sass-boilerplate/tree/master/stylesheets) som følger 7-1 mønsteret.


Oppdater filen `./src/index.html`
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>webpack ES6 demo</title>
    <link rel="stylesheet" href="/static/styles.css" />
  </head>
  <body>
    <div id="container" class="container">
    </div>
    <script type="text/javascript" src="/static/bundle.js" charset="utf-8"></script>
  </body>
</html>
```

Restart testserveren (`Ctrl+C`, deretter `./node_modules/.bin/webpack-dev-server --progress --colors`)

Lag filen `./src/html/header.html`
```html
<div class="header">
  <h2>This is a Header</h3>
</div>
```

Lag filen `./src/html/footer.html`
```html
<div class="footer">
  <h3>This is a footer</h3>
</div>
```

Organiseringen av SASS-koden følger 7-1 mønsteret nevnt i [Sass Guidelines](http://sass-guidelin.es/#the-7-1-pattern).

* ./src/
  * main.scss
  * stylesheets/
    * base/
    * components/
    * layout/
    * pages/
    * themes/
    * utils/
    * vendor/

Lag filen `./src/main.scss`
```css
@charset 'UTF-8';

// 1. Configuration and helpers
// No global Sass context, as suggested by http://bensmithett.com/smarter-css-builds-with-webpack/
// Only import what is strictly needed

// 2. Vendors
@import
  'stylesheets/vendor/normalize.css';

// 3. Base stuff
@import
  'stylesheets/base/base',
  'stylesheets/base/typography',
  'stylesheets/base/helpers';

// 4. Layout-related sections
@import
  'stylesheets/layout/header',
  'stylesheets/layout/footer';

// 5. Components

// 6. Page-specific styles

// 7. Themes
@import
  'stylesheets/themes/default';
```

Lag filen `./src/stylesheets/layout/_header.scss`
```css
.header {
  padding: 10px 0;
  background-color: silver;
}
```

Lag filen `./src/stylesheets/layout/_footer.scss`
```css
.footer {
  background-color: LightSteelBlue;
  padding-top: 1px;
  border-bottom: 3px solid #000;
}
```

Lag filen `./src/stylesheets/themes/_default.scss`
```css
html, body {
  position: relative;
  height: 100%;
  min-height: 100%;
}
body {
  background-color: green;
}
.container {
  background-color: yellow;
  height: 100%;
  min-height: 100%;
}
```

Kopier `normalize.css` fra [normalize.css](https://github.com/necolas/normalize.css/blob/master/normalize.css) til mappen `./src/stylesheets/vendor/`

Kopier `_variables.css` fra [sass-boilerplate](https://github.com/HugoGiraudel/sass-boilerplate/blob/master/stylesheets/utils/_variables.scss) til mappen `./src/stylesheets/utils/`

Kopier `_mixins.css` fra [sass-boilerplate](https://github.com/HugoGiraudel/sass-boilerplate/blob/master/stylesheets/utils/_mixins.scss) til mappen `./src/stylesheets/utils/`

Kopier `_base.scss` fra [sass-boilerplate](https://github.com/HugoGiraudel/sass-boilerplate/blob/master/stylesheets/base/_base.scss) til mappen `./src/stylesheets/base/`. Legg til følgende i toppen av fila:
```css
@import 'stylesheets/utils/variables';
@import 'stylesheets/utils/mixins';
```

Kopier `_helpers.scss` fra [sass-boilerplate](https://github.com/HugoGiraudel/sass-boilerplate/blob/master/stylesheets/base/_helpers.scss) til mappen `./src/stylesheets/base/`. Legg til følgende i toppen av fila:
```css
@import 'stylesheets/utils/variables';
```

Kopier `_typography.scss` fra [sass-boilerplate](https://github.com/HugoGiraudel/sass-boilerplate/blob/master/stylesheets/base/_typography.scss) til mappen `./src/stylesheets/base/`. Legg til følgende i toppen av fila:
```css
@import 'stylesheets/utils/variables';
```

Last ned et ikon fra f.eks. [findicons](http://findicons.com/search/smiley) til mappen `./src/components/` og omdøp filen til `smiley.png`.

Lag filen `./src/components/Person.scss`
```css
.Person {
  background-image: url('smiley.png');
  background-repeat: no-repeat;
  background-position: 4px center;
  background-size: auto 90%;
  background-color: white;
  padding-left: 54px;
}
```

Oppdater filen `./src/compoments/Person.js`
```javascript
'use strict';

import './Person.scss';

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

Oppdater filen `./src/main.js`
```javascript
'use strict';

import Person from './components/Person.js';

const element = document.querySelector('#container');
const content = document.createElement('h1');

// Content
content.classList.add('Person');
content.textContent = 'Hello ' + new Person('Leif', 'Olsen');
element.appendChild(content);

// Append header, using import html
import header from './html/header.html';
content.insertAdjacentHTML('beforebegin', header);

// Append footer, using require html
content.insertAdjacentHTML('afterend', require('./html/footer.html'));
```

Dersom testserveren kjører kan du overvåke resultatet av kodeendringene i nettlesren.


### ES6 enhetstester med Karma og Jasmine

Enhetstester er jo egentlig feigt - men noen ganger er det helt ålreit å ha dem ;-) Oppsett av testmiljø med Karma, Jasmine og PhantomJS er som følger.

* [phantomjs](https://github.com/ariya/phantomjs)
* [jasmine](https://github.com/jasmine/jasmine)
* [jasmine-core](https://github.com/jasmine/jasmine/tree/master/lib/jasmine-core)
* [karma](https://github.com/karma-runner/karma)
* [karma-jasmine](https://github.com/karma-runner/karma-jasmine)
* [karma-phantomjs-launcher](https://github.com/karma-runner/karma-phantomjs-launcher)
* [karma-sourcemap-loader](https://github.com/demerzel3/karma-sourcemap-loader)
* [karma-coverage](https://github.com/karma-runner/karma-coverage)
* [karma-spec-reporter](https://github.com/mlex/karma-spec-reporter)
* [karma-webpack](https://github.com/webpack/karma-webpack)
* [null-loader](https://github.com/webpack/null-loader)

`npm install phantomjs jasmine jasmine-core karma karma-jasmine karma-phantomjs-launcher karma-sourcemap-loader karma-coverage karma-spec-reporter karma-webpack null-loader --save-dev`

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
            test: /\.(png|jpg|gif|woff|woff2|css|sass|scss|less|styl)$/,
            loader: 'null-loader'
          },
          {
            test: /\.js[x]?$/,
            include: [
              path.join(__dirname, 'src'),
              path.join(__dirname, 'test')
            ],
            loader: 'babel-loader',
            query: {
              plugins: ['transform-runtime'],
              presets: ['es2015', 'stage-0']
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
  "dev": "./node_modules/.bin/webpack-dev-server --progress --colors",
  "test": "./node_modules/.bin/karma start",
  "build": "./node_modules/.bin/webpack"
},
```

Kjør testene: `npm test`

Testene kjøres initielt. Deretter kjøres de så snart Karma oppdager endringer i koden.

Avslutt testovervåkingen med Ctrl+C

## Nyttige lenker
* [What is webpack](http://webpack.github.io/docs/what-is-webpack.html)
* [Webpack configuration](https://webpack.github.io/docs/configuration.html)
* [WEBPACK 101: AN INTRODUCTION TO WEBPACK](http://code.hootsuite.com/webpack-101/)
* [Beginner’s guide to Webpack](https://medium.com/@dabit3/beginner-s-guide-to-webpack-b1f1a3638460#.ysa5ikt2h)
* [Introduction to Webpack with practical examples](http://julienrenaux.fr/2015/03/30/introduction-to-webpack-with-practical-examples/)
* [Setting Up a Front End Development Environment](http://www.dennyferra.com/setting-up-a-front-end-development-environment/)
* [Developing with Webpack](http://survivejs.com/webpack_react/developing_with_webpack/)
* [Linting in Webpack](http://survivejs.com/webpack_react/linting_in_webpack/)
* [Smarter CSS builds with Webpack](http://bensmithett.com/smarter-css-builds-with-webpack/)
* [Styling React Components In Sass](http://hugogiraudel.com/2015/06/18/styling-react-components-in-sass/)
* [Writing Happy Stylesheets with Webpack](http://jamesknelson.com/writing-happy-stylesheets-with-webpack/)
* [Writing Jasmine Unit Tests In ES6](http://www.syntaxsuccess.com/viewarticle/writing-jasmine-unit-tests-in-es6)
* [Tutorial – write in ES6 and Sass on the front end with Webpack and Babel](http://tech.90min.com/?p=1340)
* [Webpack CSS Example](https://github.com/bensmithett/webpack-css-example)
* [webpack-howto](https://github.com/petehunt/webpack-howto)
* [advanced-webpack](https://github.com/jcreamer898/advanced-webpack)
* [webpack-demos](https://github.com/ruanyf/webpack-demos)
* [Learn ES2015](https://babeljs.io/docs/learn-es2015/)
* [Webpack Made Simple: Building ES6 & LESS with autorefresh](http://jamesknelson.com/webpack-made-simple-build-es6-less-with-autorefresh-in-26-lines/)
* [Using ES6 and ES7 in the Browser, with Babel 6 and Webpack](http://jamesknelson.com/using-es6-in-the-browser-with-babel-6-and-webpack/)
* [A Quick Tour Of ES6 (Or, The Bits You’ll Actually Use)](http://jamesknelson.com/es6-the-bits-youll-actually-use/)
* [Get Started with ECMAScript 6](http://blog.teamtreehouse.com/get-started-ecmascript-6)
* [Exploring es6](http://exploringjs.com/es6/) (free book)
* [Understanding ECMAScript 6](https://leanpub.com/understandinges6/read) (free book)
* [ECMAScript 6 Learning](https://github.com/ericdouglas/ES6-Learning)
* [react-webpack-cookbook](https://christianalfoni.github.io/react-webpack-cookbook/index.html)
* [generator-react-webpack](https://github.com/newtriks/generator-react-webpack)
* [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit)
* [Unicorn Standard Starter Kit](https://github.com/unicorn-standard/starter-kit)
