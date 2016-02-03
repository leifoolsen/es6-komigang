# Kom i gang med ECMAScript2015 (ES6) ved hjelp av webpack og Babel

<img src="what-is-webpack.png" style="width:100%; max-width: 1200px; margin: 0 auto;" />

Webpack (the amazing module bundling Swiss army knife) er kort fortalt en pakkehåndterer og et
front-end byggesystem som preprosesserer forskjellige webressurser og samler dem i en eller
flere statiske pakker som så kan benyttes i klienten. Prosesseringen starter fra et gitt startpunkt
(entry), typisk _index.js_ eller _main.js_. Ut fra startpunktet bygger webpack en avhengighetsgraf
basert på filer som er knyttet opp via _ìmport_, _require_, _url_'er i css og _href_ i _img_ tagger.
Prosesseringen foregår via såkalte "loadere" - ganske likt "tasks" i andre byggeverktøy, som Gulp.

Ved hjelp av Babel transformeres es6 til es5, som de fleste moderne nettlesere kan kjøre.

## Hva trenger vi
* [webpack](https://webpack.github.io/)
* [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html)
* [babel-core](https://github.com/babel/babel); Node API and require hook
* [babel-loader](https://github.com/babel/babel-loader); transpiling JavaScript files using Babel and webpack.
* [babel-preset-es2015](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015); Compile ES2015 to ES5
* [babel-preset-stage-0](https://github.com/babel/babel/tree/master/packages/babel-preset-stage-0); Enable ES7
* [babel-polyfill](https://github.com/babel/babel/tree/master/packages/babel-polyfill); which when required, sets you up with a full ES2015-ish environment
* [babel-runtime](https://github.com/babel/babel/tree/master/packages/babel-runtime); allows us to require only the features we need when distributing our application without polluting the global scope
* [babel-plugin-transform-runtime](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-runtime); runtime poyfill.
* [moment](https://github.com/moment/moment/); parse, validate, manipulate, and display dates in JavaScript

### Opprett et prosjekt og installer _webpack_ og _Babel_
[NodeJS](https://nodejs.org/en/) må være installert på forhånd og det forutsettes at du har grunnleggende kunnskap om NodeJS.

#### Prosjektstruktur
```
mkdir es6-komigang
cd es6-komigang
mkdir src
mkdir src/js
mkdir src/js/components
npm init -y
```

#### Prosjektstruktur dersom du følger hele eksemplet

```
|
+-- src
|   +-- html
|   +-- js
|   |   +-- components
|   +-- stylesheets
|   |   +-- base
|   |   +-- components
|   |   +-- layout
|   |   +-- pages
|   |   +-- themes
|   |   +-- utils
|   |   +-- vendor
+-- test
|   +-- js
|   |   +-- components
+-- stub-server
|   +-- data
+-- config
```


#### Installer nødvendige pakker
```
# webpack
npm install --save-dev webpack webpack-dev-server

# babel-core and babel-loader
npm install --save-dev babel-core babel-loader

# ES2015/ES6
npm install --save-dev babel-preset-es2015

# ES7
npm install --save-dev babel-preset-stage-0

# Runtime support
npm install --save babel-polyfill
npm install --save babel-runtime
npm install --save-dev babel-plugin-transform-runtime

# ES6 Promise, for node < v4
npm install --save dev es6-promise

# 3'dje parts bibliotek. Benyttes for å demonstrere splitting av JavaScript
npm install --save moment
```


Dette gir følgende `package.json` i prosjektkatalogen:
```javascript
{
  "name": "es6-komigang",
  "version": "0.0.1",
  "description": "Kom i gang med ES6 ved hjelp av webpack og Babel",
  "main": "webpack.config.js",
  "dependencies": {
    "babel-polyfill": "^6.2.0",
    "babel-runtime": "^6.2.0",
    "moment": "^2.10.6"
  },
  "devDependencies": {
    "babel-core": "^6.2.1",
    "babel-loader": "^6.2.0",
    "babel-plugin-transform-runtime": "^6.1.18",
    "babel-preset-es2015": "^6.1.18",
    "babel-preset-stage-0": "^6.1.18",
    "es6-promise": "^3.0.2",
    "webpack": "^1.12.9",
    "webpack-dev-server": "^1.14.0"
  },
  "scripts": {
    "dev": "./node_modules/.bin/webpack-dev-server --hot --inline --module-bind --progress --color",
    "build": "./node_modules/.bin/webpack",
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
if (!global.Promise) {
  global.Promise = require('es6-promise').polyfill();
}
const webpack = require('webpack');
const path = require('path');

module.exports = {
  debug: true,
  cache: true,
  devtool: 'eval-source-map',
  entry: {
    app: [
      'babel-polyfill',
      path.join(__dirname, 'src/main.js') 
    ],
    vendor: [ 
      'moment'
    ]
  },
  output: {
    path             : path.join(__dirname, 'dist'),
    filename         : '[name].js',
    sourceMapFilename: '[file].map',
    pathinfo         : true,
    publicPath       : '/static/'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.css', '.scss']
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,                    
        include: path.join(__dirname, "src"), 
        loader: 'babel-loader',
        query: {                              
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    })
  ],
  devServer: {
    contentBase: './src',
    port: 8080
  }
};
```

En god beskrivelse av hvordan man setter opp Babel sammen med webpack finner du bl.a. her:
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
    <script type="text/javascript" src="/static/vendor.js" charset="utf-8"></script>
    <script type="text/javascript" src="/static/app.js" charset="utf-8"></script>
  </body>
</html>
```

### Lag filen _./src/components/Person.js_
```javascript
'use strict';
class Person {
  constructor(_first, _last) {
    this._first = _first;
    this._last = _last;
  }
  get name() {
    return this.first + ' ' + this.last;
  }
  toString() {
    return this.name;
  }
}
export default Person;
```

### Lag filen _./src/main.js_
```javascript
'use strict';

import moment from 'moment';
import Person from './js/components/Person.js';

class App {
  const run() {
    const element = document.querySelector('#container');
    const person = new Person('Leif', 'Olsen');
    const content = document.createElement('h1');
    content.classList.add('Person');
    content.textContent = `${moment().format('YYYY-MM-DD HH:mm:ss')}: Yo ${person}`;
    element.appendChild(content);
  }
}
document.addEventListener('DOMContentLoaded', () => App.run());
```

### Prøv ut koden
* Åpne et terminalvindu og start utviklingsserveren med følgende kommando: `npm run dev`    
* Åpne nettleseren og naviger til: http://localhost:8080/webpack-dev-server/
* Eventuelle endringer i koden kan du observere fortløpende i terminalvinduet og i nettleseren.
* Stopp serveren med `Ctrl+C`
* Kjør kommandoen `npm run build` og verifiser at `./dist`katalogen inneholder filene `vendor.js` og `app.js`

Dette er i hovedsak utviklingsmiljøet du trenger for å komme i gang med ECMAScript 2015, ES6.

Resten av eksemplet forutsetter at du benytter __Node-4.x__ eller [__Node-5.x__](https://nodejs.org/en/)!


## Polyfills og Shims
TODO


## Konfigurernig av Node og Webpack vha node-config
TODO
 
 
## Rest-api med Node Express
Dette avsnittet viser hvordan man kan sette opp Node Express i et ES6-miljø og hvordan man setter opp en proxy fra
webpack dev server til Node Express slik at man enkelt kan prøve ut ES6 fetch-api'et.

....... Ved koding av frontend kan man benytte Node Express som rest-api stubserver. .......
TODO



## Forbedret arbeidsflyt med kodeanalyse, enhetstester og prosessering av statiske ressurser

I de neste avsnittene viser jeg hvordan man kan legge til flere nyttige verktøy.

### EsLint
Kontinuerlig kodeanalyse for å avdekke potensielle problemer er greit å ha i arbeidsflyten. Til det trenger vi følgende:

* [eslint](https://github.com/eslint/eslint); the linting tool
* [eslint-config-standard](https://github.com/feross/eslint-config-standard); a set of configurations for eslint
* [babel-eslint](https://github.com/babel/babel-eslint); a parser for eslint that teaches the linter about experimental features that aren’t in ES6.
* [eslint-loader](https://github.com/MoOx/eslint-loader); eslint loader for webpack

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
* [node-sass](https://github.com/sass/node-sass)
* [file-loader](https://github.com/webpack/file-loader)
* [url-loader](https://github.com/webpack/url-loader)
* [extract-text-webpack-plugin](https://github.com/webpack/extract-text-webpack-plugin)
* [autoprefixer](https://github.com/postcss/autoprefixer)
* [postcss-loader](https://github.com/postcss/postcss-loader)
* [resolve-url-loader](https://github.com/bholloway/resolve-url-loader)
* [autoprefixer](https://github.com/postcss/autoprefixer)

```
npm install --save-dev html-loader
npm install --save-dev style-loader
npm install --save-dev css-loader
npm install --save-dev sass-loader
npm install --save-dev node-sass
npm install --save-dev file-loader
npm install --save-dev url-loader
npm install --save-dev extract-text-webpack-plugin
npm install --save-dev autoprefixer postcss-loader
npm install --save-dev resolve-url-loader  
npm install --save-dev autoprefixer  
```

Legg til følgende kode i `./webpack.config.js` for å håndtere statiske ressurser.
```javascript
if (!global.Promise) {
  global.Promise = require('es6-promise').polyfill();
}
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const cssLoader = [
  'css-loader?sourceMap',
  'postcss-loader'
].join('!');

const sassLoader = [
  'css-loader?sourceMap',
  'postcss-loader',
  'resolve-url-loader',
  'sass-loader?sourceMap&expanded'
].join('!');

module.exports = {
  entry: {
    app: [
      path.join(__dirname, 'src/main.scss'), // Styles
      'babel-polyfill',                      // Babel requires some helper code to be run before your application
      path.join(__dirname, 'src/main.js')    // Add your application's scripts last
    ],
    vendor: [
      'moment'
    ]
  },
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
    { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=16384&minetype=application/font-woff" },
    { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?limit=16384" }
  ],
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
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

Loadere evalueres fra høyre mot venstre: SCSS-filer kompileres med SASS, deretter kjører autoprefixer, så produseres
en CSS-fil; `./dist/styles.css`. CSSfilen produseres på bakgrunn av de SASS/CSS-modulene som importeres i
`./src/main.scss` og hvilke SASS/CSS-moduler som refereres i JavaScriptkoden; `Person.js` og `Person.scss`. Fordelen
med en CSSfil generert av webpack er at produsert CSSfil kun inneholder kode som man faktisk bruker. Hvordan dette
foregår i praksis er godt forklart i artikkelen
[Smarter CSS builds with Webpack](http://bensmithett.com/smarter-css-builds-with-webpack/). CSS-strukturen som benyttes
i dette eksemplet er omtalt i [Sass Guidelines, The 7-1 Pattern](http://sass-guidelin.es/#the-7-1-pattern). Det meste ev
SASSkoden er hentet fra  [sass-boilerplate](https://github.com/HugoGiraudel/sass-boilerplate/tree/master/stylesheets)
som følger 7-1 mønsteret.


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
    <script type="text/javascript" src="/static/vendor.js" charset="utf-8"></script>
    <script type="text/javascript" src="/static/app.js" charset="utf-8"></script>
  </body>
</html>
```

Restart serveren (`Ctrl+C`, deretter `npm run dev`)

Lag filen `./src/html/header.html`
```html
<div class="header">
  <h2>Header ...</h3>
</div>
```

Lag filen `./src/html/footer.html`
```html
<div class="footer">
  <h3>Footer ...</h3>
</div>
```

Organiseringen av SASS-koden bør følge 7-1 mønsteret nevnt i [Sass Guidelines](http://sass-guidelin.es/#the-7-1-pattern).

```
|
+-- src/
|   +-- main.scss
|   +-- stylesheets/
|   |   +-- base/
|   |   +-- components/
|   |   +-- layout/
|   |   +-- pages/
|   |   +-- themes/
|   |   +-- utils/
|   |   +-- vendor
```

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

Lag filen `./src/js/components/Person.scss`
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
  constructor(_first, _last) {
    this._first = _first;
    this._last = _last;
  }
  get name() {
    return this.first + ' ' + this.last;
  }
  toString() {
    return this.name;
  }
}
export default Person;
```

Oppdater filen `./src/main.js`

```javascript
'use strict';

import moment from 'moment';
import Person from './js/components/Person.js';

// Get header html, using import
import header from './html/header.html';

// Get footer html, using require
const footer = require('./html/footer.html');

class App {
  const run() {
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
```

Dersom testserveren kjører kan du overvåke resultatet av kodeendringene i nettleseren.


### ES6 enhetstester med Karma og Jasmine

Enhetstester er jo egentlig feigt - men noen ganger er det helt ålreit å ha dem ;-) Oppsett av testmiljø med Karma,
Jasmine og PhantomJS er som følger.

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

Lag filen `./test/js/components/Person-spec.js`

```javascript
'use strict';
import Person from '../../../src/js/components/Person';
describe('Person', () => {
   it('should say hello to leif', () => {
       let person = new Person('Leif', 'Olsen');
       expect(person.name).toBe('Leif Olsen');
   });
});
```

Oppdater "scripts"-blokken i `./package.json`.

```javascript
"scripts": {
  "dev": "./node_modules/.bin/webpack-dev-server --hot --inline --module-bind --progress --color",
  "build": "./node_modules/.bin/webpack",
  "test": "./node_modules/.bin/karma start"
},
```

Kjør testene: `npm test`

Testene kjøres initielt. Deretter kjøres testene så snart Karma oppdager endringer i koden.

Avslutt testovervåkingen med Ctrl+C


__TODO:__ Vurder Mocha, Chai og JsDom i stedet for Karma? 
Se: 
[From Karma to Mocha, with a taste of jsdom](https://medium.com/podio-engineering-blog/from-karma-to-mocha-with-a-taste-of-jsdom-c9c703a06b21#.gvhl3kd1e),
[Webpack testing](https://webpack.github.io/docs/testing.html), 
[A modern React starter pack based on webpack](http://krasimirtsonev.com/blog/article/a-modern-react-starter-pack-based-on-webpack)



## React
For å komme i gang med React trenger du som et minimum:
```
npm istall --save react react-dom
npm install --save-dev babel-preset-react
```

Og `babel-loader` i `webpack.config.js` blir da:
```javascript
{
  test: /\.js[x]?$/,                     // Only run `.js` and `.jsx` files through Babel
  include: path.join(__dirname, 'src'),  // Skip any files outside of your project's `src` directory
  loader: 'babel-loader',
  query: {                               // Options to configure babel with
    plugins: ['transform-runtime'],
    presets: ['es2015', 'stage-0', 'react']
  }
},
```

## Nyttige lenker

### ES6
* [Learn ES2015](https://babeljs.io/docs/learn-es2015/)
* [babel-plugin-handbook](https://github.com/thejameskyle/babel-plugin-handbook)
* [Using ES6 and ES7 in the Browser, with Babel 6 and Webpack](http://jamesknelson.com/using-es6-in-the-browser-with-babel-6-and-webpack/)
* [A Quick Tour Of ES6 (Or, The Bits You’ll Actually Use)](http://jamesknelson.com/es6-the-bits-youll-actually-use/)
* [The Six Things You Need To Know About Babel 6](http://jamesknelson.com/the-six-things-you-need-to-know-about-babel-6/)
* [The Complete Guide to ES6 with Babel 6](http://jamesknelson.com/the-complete-guide-to-es6-with-babel-6/)
* [Get Started with ECMAScript 6](http://blog.teamtreehouse.com/get-started-ecmascript-6)
* [Exploring es6](http://exploringjs.com/es6/), free book
* [Understanding ECMAScript 6](https://leanpub.com/understandinges6/read), free book
* [ECMAScript 6 Learning](https://github.com/ericdouglas/ES6-Learning)
* [ECMAScript 6 — New Features: Overview & Comparison](http://es6-features.org/#Constants)
* [ECMAScript 6 equivalents in ES5](https://github.com/addyosmani/es6-equivalents-in-es5)
* [ECMAScript 6 Tools](https://github.com/addyosmani/es6-tools)
* [ECMAScript 6 - git.io/es6features](https://github.com/lukehoban/es6features)
* [Making the most of JavaScript’s “future” today with Babel](https://strongloop.com/strongblog/javascript-babel-future/)
* [How to Write an Open Source JavaScript Library](https://egghead.io/lessons/javascript-how-to-write-a-javascript-library-introduction)
* [fetch API](https://davidwalsh.name/fetch)
* [window.fetch polyfill](https://github.com/github/fetch)
* [isomorphic-fetch - Fetch for node and Browserify. Built on top of GitHub's WHATWG Fetch polyfill.](https://github.com/matthew-andrews/isomorphic-fetch)
* [core-decorators.js](https://github.com/jayphelps/core-decorators.js)
* [Exploring ES2016 Decorators](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.5z8emeo19)
* [7 Patterns to Refactor JavaScript Applications: Decorators](https://blog.engineyard.com/2015/7-patterns-refactor-javascript-decorators)
* [Decorators in JavaScript](https://www.youtube.com/watch?v=d8CDFsQHZpE)
* [lodash-decorators](https://github.com/steelsojka/lodash-decorators)
* [javascript-decorators](https://github.com/wycats/javascript-decorators)
* [Using ES7 Decorators with Babel 6](http://technologyadvice.github.io/es7-decorators-babel6/)
* [Google Developers - Introduction to fetch](https://developers.google.com/web/updates/2015/03/introduction-to-fetch?hl=en)
* [Preparing for ECMAScript 6: New String Methods](http://www.sitepoint.com/preparing-ecmascript-6-new-string-methods/)
* [Basic Data structures in ES6](http://www.sublimejs.com/-basic-data-structure-in-es6/)
* [Understanding ES6 Modules](http://www.sitepoint.com/understanding-es6-modules/)
* [The JavaScript Looping Evolution](http://developer.telerik.com/featured/the-javascript-looping-evolution/)
* [Cookbook (es6)](https://github.com/nervgh/recursive-iterator/wiki/Cookbook-(es6))
* [ES6 - Sean Saranga Amarasinghe](http://seanamarasinghe.com/developer/javascript/es6/)
* [Understanding ECMAScript 6 arrow functions](https://www.nczonline.net/blog/2013/09/10/understanding-ecmascript-6-arrow-functions/)
* [ES6 arrow functions, syntax and lexical scoping](https://toddmotto.com/es6-arrow-functions-syntaxes-and-lexical-scoping/)
* [ES6 in the Wild](http://kahnjw.com/posts/5/)
* [JavaScript Design Patterns in ES 2015](http://joshbedo.github.io/JS-Design-Patterns/)
* [Using the ES6 transpiler Babel on Node.js](http://www.2ality.com/2015/03/babel-on-node.html)
* [Finitely Iterating Infinite Data With ES6 Generators](http://derickbailey.com/categories/tips-and-tricks/)
* [JavaScript Promises](http://www.html5rocks.com/en/tutorials/es6/promises/)
* [Easy asynchrony with ES6](https://curiosity-driven.org/promises-and-generators)
* [That's so fetch!](https://jakearchibald.com/2015/thats-so-fetch/)
* [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
* [HTML5 Local Storage and Session Storage](http://javaninja.net/2015/08/html5-local-storage-and-session-storage/)
* [Storing Data on The Client with LocalStorage](http://blog.teamtreehouse.com/storing-data-on-the-client-with-localstorage)
* [The Basics Of ES6 Generators](https://davidwalsh.name/es6-generators)
* [Diving Deeper With ES6 Generators](https://davidwalsh.name/es6-generators-dive)
* [ES6 Promises in Depth](https://ponyfoo.com/articles/es6-promises-in-depth)
* [ES 7 decorators to reduce boilerplate when creating custom HTML elements.](https://github.com/patrickarlt/custom-element-decorators)
* [HTML templating with ES6 template strings](http://www.2ality.com/2015/01/template-strings-html.html)
* [es6-template-demo - working demo code from http://www.2ality.com/2015/01/template-strings-html.html](https://github.com/dannyko/es6-template-demo)
* [Getting Literal With ES6 Template Strings](https://developers.google.com/web/updates/2015/01/ES6-Template-Strings?hl=en)
* [The Genius of Template Strings in ES6](http://code.tutsplus.com/tutorials/the-genius-of-template-strings-in-es6--cms-24915)
* [ES6 In Depth: Template strings](https://hacks.mozilla.org/2015/05/es6-in-depth-template-strings-2/)
* [HTML Exports](https://github.com/nevir/html-exports)
* [SystemJS](https://github.com/systemjs/systemjs)
* [How to Implement HTML5 Local Storage](https://www.safaribooksonline.com/blog/2013/10/10/how-to-use-html5-local-storage/)
* [JavaScript Fetch API in action](https://blog.gospodarets.com/fetch_in_action/)
* [Creating an ES6 DOM Library](http://www.ericponto.com/blog/2014/10/05/es6-dom-library/)
* [Digging into the modern JavaScript - ES6](http://nanovazquez.com/2015/12/24/digging-into-the-modern-javascript-es6/)
* [Start your own JavaScript library using webpack and ES6](http://krasimirtsonev.com/blog/article/javascript-library-starter-using-webpack-es6)
* [Real Life ES6 - Arrow Functions](http://javascriptplayground.com/blog/2014/04/real-life-es6-arrow-fn/)
* [i18n with tagged template strings in ECMAScript 6](http://jaysoo.ca/2014/03/20/i18n-with-es6-template-strings/)
* [You Don't Know JS (book series)](https://github.com/getify/You-Dont-Know-JS)
* [promise-cookbook](https://github.com/mattdesl/promise-cookbook)
* [promise-cookbook](https://github.com/wbinnssmith/promise-cookbook)
* [Web Components, by Bill Stavroulakis](http://bstavroulakis.com/blog/web/web-components-html-templates/)
* [Riot.js - A React-like user interface micro-library](https://github.com/riot/riot)
* [Enumify - A JavaScript library for enums. To be used by transpiled ES6](https://github.com/rauschma/enumify)
* [Future JavaScript](https://github.com/jedrichards/es6)
* [Vanilla JavaScript TodoMVC Example](https://github.com/kentcdodds/es6-todomvc)
* [Vanilla ES6 (ES2015) • TodoMVC](https://github.com/addyosmani/es2015-todomvc-chrome)
* [Mozilla - ES6 In Depth Articles](https://hacks.mozilla.org/category/es6-in-depth/)
* [ES6 One Liners to Show Off](http://h3manth.com/new/blog/2014/es6-one-liners-to-show-off/)
* [Lightweight ES6 Features That Pack A Punch](http://colintoh.com/blog/lightweight-es6-features)
* [Staying Sane With Asynchronous Programming: Promises and Generators](http://colintoh.com/blog/staying-sane-with-asynchronous-programming-promises-and-generators)

### events, EventEmitter, PubSub
* [Implementing EventEmitter in ES6](http://www.datchley.name/es6-eventemitter/)
* [Pub Sub with Event Emitter](http://javascriptplayground.com/blog/2014/03/event-emitter/)
* [Node.js EventEmitter Tutorial](http://www.hacksparrow.com/node-js-eventemitter-tutorial.html)
* [Becoming fully reactive: an in-depth explanation of Mobservable]


### RxJS
* [ReactiveX - The Observer pattern done right](http://reactivex.io/)
* [RxJS 5, beta - Compliant with the EcmaScript Observable Spec](https://github.com/ReactiveX/RxJS)
* [The Reactive Extensions for JavaScript (RxJS) 4.0](https://github.com/Reactive-Extensions/RxJS)
* [ReactiveX tutorials](http://reactivex.io/tutorials.html)
* [RxJS v4.0 - an on-line book by Dennis Stoyanov](https://xgrommx.github.io/rx-book/index.html)
* [Fluorine - State Accumulation from a single stream of actions](https://github.com/philplckthun/fluorine)
* [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
* [Functional Programming in Javascript](http://reactivex.io/learnrx/)
* [RxJS Evolved](http://www.slideshare.net/trxcllnt/rxjs-evolved)
* [What Is RxJS?](https://egghead.io/lessons/rxjs-what-is-rxjs)
* [RxJS 5](https://discventionstech.wordpress.com/2015/10/29/rxjs-5/)
* [HOW TO DEBUG RXJS CODE](http://staltz.com/how-to-debug-rxjs-code.html)
* [Create a simple toggle button using reactive programming](https://www.themarketingtechnologist.co/create-a-simple-toggle-button-with-rxjs-using-scan-and-startwith/)
* [HOW TO DEBUG RXJS CODE](http://staltz.com/how-to-debug-rxjs-code.html)
* [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
* [RxJS Observables vs Promises](https://egghead.io/lessons/rxjs-rxjs-observables-vs-promises)
* [RxJS tutorials](http://reactivex.io/tutorials.html)
* [Rxmq.js - JavaScript pub/sub library based on RxJS](https://github.com/rxmqjs/rxmq.js)
* [Flyd - The modular, KISS, functional reactive programming library for JavaScript.](https://github.com/paldepind/flyd)
* [Cycle.js - A functional and reactive JavaScript framework for cleaner code](http://cycle.js.org/)
* [ReactiveX - The Observer pattern done right](http://reactivex.io/)


### Webpack
* [What is webpack](http://webpack.github.io/docs/what-is-webpack.html)
* [Webpack configuration](https://webpack.github.io/docs/configuration.html)
* [WEBPACK 101: AN INTRODUCTION TO WEBPACK](http://code.hootsuite.com/webpack-101/)
* [Webpack and Babel – ES6 & ES7 on the front end](http://tech.90min.com/?p=1333)
* [Tutorial – write in ES6 and Sass on the front end with Webpack and Babel](http://tech.90min.com/?p=1340)
* [Beginner’s guide to Webpack](https://medium.com/@dabit3/beginner-s-guide-to-webpack-b1f1a3638460#.ysa5ikt2h)
* [Introduction to Webpack with practical examples](http://julienrenaux.fr/2015/03/30/introduction-to-webpack-with-practical-examples/)
* [Setting Up a Front End Development Environment](http://www.dennyferra.com/setting-up-a-front-end-development-environment/)
* [Developing with Webpack](http://survivejs.com/webpack_react/developing_with_webpack/)
* [webpack-howto](https://github.com/petehunt/webpack-howto)
* [Creating a workflow with WebPack](http://christianalfoni.github.io/javascript/2014/12/13/did-you-know-webpack-and-react-is-awesome.html)
* [advanced-webpack](https://github.com/jcreamer898/advanced-webpack)
* [webpack-demos](https://github.com/ruanyf/webpack-demos)
* [Webpack Made Simple: Building ES6 & LESS with autorefresh](http://jamesknelson.com/webpack-made-simple-build-es6-less-with-autorefresh-in-26-lines/)
* [pushState With Webpack-dev-server](http://jaketrent.com/post/pushstate-webpack-dev-server/)
* [How to store assets separately with Webpack](http://stackoverflow.com/questions/31399715/how-to-store-assets-separately-with-webpack?rq=1)
* [How to configure font file output directory from font-awesome-webpack in webpack?](http://stackoverflow.com/questions/34014151/how-to-configure-font-file-output-directory-from-font-awesome-webpack-in-webpack)
* [Introduction to Webpack](http://seanamarasinghe.com/developer/introduction-to-webpack/)
* [Advanced WebPack Part 1 - The CommonsChunk Plugin](http://jonathancreamer.com/advanced-webpack-part-1-the-commonschunk-plugin/)
* [webpack-babel-boilerplate](https://github.com/shovon/webpack-babel-boilerplate)
* [Start your own JavaScript library using webpack and ES6](http://krasimirtsonev.com/blog/article/javascript-library-starter-using-webpack-es6)
* [babel-npm-boilerplate](https://github.com/camsong/babel-npm-boilerplate)


### CSS/SASS
* [Smarter CSS builds with Webpack](http://bensmithett.com/smarter-css-builds-with-webpack/)
* [Styling React Components In Sass](http://hugogiraudel.com/2015/06/18/styling-react-components-in-sass/)
* [Writing Happy Stylesheets with Webpack](http://jamesknelson.com/writing-happy-stylesheets-with-webpack/)
* [Tutorial – write in ES6 and Sass on the front end with Webpack and Babel](http://tech.90min.com/?p=1340)
* [Webpack CSS Example](https://github.com/bensmithett/webpack-css-example)
* [Faster SASS builds with Webpack](http://eng.localytics.com/faster-sass-builds-with-webpack/)
* [Roboto fontface](https://github.com/choffmeister/roboto-fontface-bower)
* [Google Fonts Files](https://github.com/google/fonts)
* [font-roboto-local](https://github.com/PolymerElements/font-roboto-local)
* [font-awesome-webpack](https://github.com/gowravshekar/font-awesome-webpack)
* [Myth - CSS the way it was imagined](http://www.myth.io/)
* [Introduction to Myth – CSS Preprocessor](http://www.sevensignature.com/blog/home/myth-css-preprocessor/)
* [Modernizr - Respond to your user’s browser features.](https://modernizr.com/)
* [modernizr-loader for webpack](https://github.com/peerigon/modernizr-loader)
* [CSS4 variables in SASS - HOUSTON, WE WILL PROBABLY END UP TOTALLY HAVING A PROBLEM](http://codepen.io/jakealbaugh/post/css4-variables-and-sass)
* [Why I'm Excited About Native CSS Variables](http://philipwalton.com/articles/why-im-excited-about-native-css-variables/)
* [A Polyfill for CSS3 calc()](https://github.com/closingtag/calc-polyfill)
* [Writing a CSS Parser in JavaScript](https://medium.com/jotform-form-builder/writing-a-css-parser-in-javascript-3ecaa1719a43#.bwpkdrlis)
* [css.js - A lightweight, battle tested, fast, css parser in JavaScript](https://github.com/jotform/css.js)
* [matchMedia() polyfill - test whether a CSS media type or media query applies](https://github.com/paulirish/matchMedia.js/)   
* [Respond.js - A fast & lightweight polyfill for min/max-width CSS3 Media Queries (for IE 6-8, and more)](https://github.com/scottjehl/Respond)
* [Animate.css - A cross-browser library of CSS animations.](https://github.com/daneden/animate.css)
* [CSS next - Use tomorrow's CSS syntax, today.](http://cssnext.io/)
* [COLORS - A nicer color palette for the web.](http://clrs.cc/)
* [How to use responsive breakpoint analytics to measure design performance](https://www.themarketingtechnologist.co/how_to_use_responsive_breakpoint_analytics_to_measure_design_performance/)

### Lint
* [Configuring ESLint](http://eslint.org/docs/user-guide/configuring.html)
* [.eslintrc](https://gist.github.com/cletusw/e01a85e399ab563b1236)
* [Linting in Webpack](http://survivejs.com/webpack_react/linting_in_webpack/)


### Test
* [Writing Jasmine Unit Tests In ES6](http://www.syntaxsuccess.com/viewarticle/writing-jasmine-unit-tests-in-es6)
* [Webpack testing](https://webpack.github.io/docs/testing.html)
* [Testing with webpack and Mocha](https://www.youtube.com/watch?v=_sLLjPzOrXI)
* [From Karma to Mocha, with a taste of jsdom](https://medium.com/podio-engineering-blog/from-karma-to-mocha-with-a-taste-of-jsdom-c9c703a06b21#.uqrd94da2)
* [Automated Node.js Testing with Jasmine](https://www.distelli.com/docs/tutorials/test-your-nodejs-with-jasmine)
* [How to easily test React components with Karma and Webpack](http://qiita.com/kimagure/items/f2d8d53504e922fe3c5c)
* [How to test React components using Karma and webpack](http://nicolasgallagher.com/how-to-test-react-components-karma-webpack/)
* [Node.js and ES6 Instead of Java – A War Story](http://www.technology-ebay.de/the-teams/mobile-de/blog/nodejs-es6-war-story-2)
* [js-tests-pro](https://github.com/500tech/js-tests-pro)
* [webpack-mocha-demo](https://github.com/jesseskinner/webpack-mocha-demo)
* [Universal (isomorphic) boilerplate written in ES2015 for Node and the browser.](https://github.com/kflash/trolly)
* [A modern React starter pack based on webpack](http://krasimirtsonev.com/blog/article/a-modern-react-starter-pack-based-on-webpack)
* [From Karma to Mocha, with a taste of jsdom](https://medium.com/podio-engineering-blog/from-karma-to-mocha-with-a-taste-of-jsdom-c9c703a06b21#.gvhl3kd1e)
* [Testing with webpack and Mocha](https://www.youtube.com/watch?v=_sLLjPzOrXI)
* [Testing in ES6 with Mocha and Babel 6](http://jamesknelson.com/testing-in-es6-with-mocha-and-babel-6/)
* [Setting up Unit Testing with Mocha and Chai](https://egghead.io/lessons/javascript-how-to-write-a-javascript-library-setting-up-unit-testing-with-mocha-and-chai)
* [Adding ES6 Support to Tests using Mocha and Babel](https://egghead.io/lessons/javascript-how-to-write-a-javascript-library-adding-es6-support-to-tests-using-mocha-and-babel)
* [Testing React on Jsdom](http://jaketrent.com/post/testing-react-with-jsdom/)
* [Sinon Spies vs. Stubs](http://jaketrent.com/post/sinon-spies-vs-stubs/)
* [testing-with-karma-webpack](http://slidedeck.io/pascalpp/testing-with-karma-webpack)
* [Tutorial – write in ES6 and Sass on the front end with Webpack and Babel](http://tech.90min.com/?p=1340)
* [JavaScript Design Patterns in ES 2015](http://joshbedo.github.io/JS-Design-Patterns/)


### NoeJS, Express
* [Running scripts with npm](http://www.jayway.com/2014/03/28/running-scripts-with-npm/)
* [Node.js Tutorials](https://www.codementor.io/nodejs/tutorial)
* [NODESCHOOL](http://nodeschool.io/)
* [Howto Node](http://howtonode.org/)
* [webpack-express-boilerplate](https://github.com/christianalfoni/webpack-express-boilerplate)
* [Getting Started with Express - Up and Running](https://egghead.io/lessons/node-js-getting-started-with-express-up-and-running)
* [react-express-babel6](https://github.com/shantanuraj/react-express-babel6)
* [Using ES6/ES2015 in a Node.JS and Express](https://www.lookami.com/using-es6-es2015-in-a-node-js-express/)
* [Dropbox Express with ECMAScript 6+](http://notebook.erikostrom.com/2015/05/22/dropbox-express-with-ecmascript-6.html)
* [Express & ES6 REST API Boilerplate](https://github.com/developit/express-es6-rest-api)
* [nodemon](https://github.com/remy/nodemon)
* [Build a RESTful API Using Node and Express 4](https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4)
* [Building a Node.js REST API with Express](https://medium.com/@jeffandersen/building-a-node-js-rest-api-with-express-46b0901f29b6#.9bsnbvr41)
* [Node.js - Express Framework](http://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm)
* [ExpressJs Router Tutorial](https://codeforgeek.com/2015/05/expressjs-router-tutorial/)
* [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
* [Create a character voting app using React, Node.js, MongoDB and Socket.IO](http://sahatyalkabov.com/create-a-character-voting-app-using-react-nodejs-mongodb-and-socketio/)
* [Universal (isomorphic) boilerplate written in ES2015 for Node and the browser.](https://github.com/Kflash/trolly)
* [Example Node Server w/ Babel](https://github.com/babel/example-node-server)
* [NodeJS Express ES6 Hello world](https://github.com/500tech/nodejs-express-es6)
* [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
* [Expressive ES6 features that shine in Node.js 4.0](http://rethinkdb.com/blog/node-4/)
* [Configure your Node.js Applications](https://github.com/lorenwest/node-config)
* [Architecting a Secure RESTful Node.js app](http://thejackalofjavascript.com/architecting-a-restful-node-js-app/)
* [Passport - Simple, unobtrusive authentication for Node.js](http://passportjs.org/)
* [express-validator - An express.js middleware for node-validator.](https://github.com/ctavan/express-validator)
* [NodeJS Tutorial Playlist](https://www.youtube.com/playlist?list=PLZm85UZQLd2Q946FgnllFFMa0mfQLrYDL)
* [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)
* [How I Structure RESTful APIs using Express 4.](http://www.codekitchen.ca/guide-to-structuring-and-building-a-restful-api-using-express-4/)
* [easy-express-controllers](https://github.com/arackaf/easy-express-controllers)
* [NodeJS and ES6](https://www.youtube.com/watch?v=PBLwtZRNh2M)


### Videos
* [Decorators in JavaScript](https://www.youtube.com/watch?v=d8CDFsQHZpE)
* [What Is RxJS?](https://egghead.io/lessons/rxjs-what-is-rxjs)
* [RxJS 5](https://discventionstech.wordpress.com/2015/10/29/rxjs-5/)
* [Promise to not use Promises – ES7 Observables by Brian Holt](https://www.youtube.com/watch?v=DaCc8lckuw8)
* [NodeJS and ES6](https://www.youtube.com/watch?v=PBLwtZRNh2M)
* [Async JavaScript with Promises](https://www.youtube.com/watch?v=g90irqWEqd8)


### Etc
* [A modern React starter pack based on webpack](http://krasimirtsonev.com/blog/article/a-modern-react-starter-pack-based-on-webpack)
* [react-webpack-cookbook](https://christianalfoni.github.io/react-webpack-cookbook/index.html)
* [Frontend development with webpack, json-server, tape and NPM — Pt. 1](https://medium.com/@pcruz7/frontend-development-with-webpack-json-server-tape-and-npm-pt-1-62c7601b62c1#.4bftnlffp)
* [Nock](https://github.com/pgte/nock)
* [Mocking API Requests in Node tests](http://javascriptplayground.com/blog/2013/08/mocking-web-requests/)
* [JSON Server](https://github.com/typicode/json-server)
* [Creating Demo APIs with json-server](https://egghead.io/lessons/nodejs-creating-demo-apis-with-json-server)
* [Node EasyMock Server](https://github.com/cyberagent/node-easymock)
* [Setup Webpack on an ES6 React app with SASS](http://marmelab.com/blog/2015/05/18/setup-webpack-for-es6-react-application-with-sass.html)
* [How to easily test React components with Karma and Webpack](http://qiita.com/kimagure/items/f2d8d53504e922fe3c5c)
* [How to test React components using Karma and webpack](http://nicolasgallagher.com/how-to-test-react-components-karma-webpack/)
* [Redux](https://github.com/rackt/redux)
* [Aurelia - next gen JavaScript client framework](http://aurelia.io/)
* [rivets.js - Lightweight and powerful data binding + templating solution for building modern web applications.](http://rivetsjs.com/)
* [JavaScript Air - The live broadcast podcast all about JavaScript](http://javascriptair.com/)
* [updtr - Update outdated npm modules with zero pain](https://github.com/peerigon/updtr)
* [javascriptkicks](http://javascriptkicks.com/stories)
* [router.js](https://github.com/tildeio/router.js)
* [hyperagent.js - A HAL client for JavaScript http://weluse.github.io/hyperagent](https://github.com/weluse/hyperagent)
* [HTMLBars](https://github.com/tildeio/htmlbars)
* [DOMtastic - Small, fast, and modular DOM & Event library for modern browsers](https://github.com/webpro/DOMtastic)
* [ES6-DOM](https://github.com/nickeljew/es6-dom)
* [stevia: Natural sweetener for Javascript Objects](https://github.com/traviskaufman/stevia)
* [html-template-tag](https://github.com/AntonioVdlC/html-template-tag)
* [smooth-scroll](https://github.com/tuxsudo/smooth-scroll)
* [How to forget about jQuery and start using native JavaScript APIs](http://blog.romanliutikov.com/post/63383858003/how-to-forget-about-jquery-and-start-using-native)
* [You Don't Need jQuery!](http://blog.garstasio.com/you-dont-need-jquery/selectors/)
* [Native JavaScript Equivalents of jQuery Methods: the DOM and Forms](http://www.sitepoint.com/jquery-vs-raw-javascript-1-dom-forms/)
* [Bliss: Want to use Vanilla JS but find native APIs a bit unwieldy? Bliss is for you.](http://blissfuljs.com/index.html)
* [Bliss: Heavenly JavaScript](https://github.com/LeaVerou/bliss)
* [Dom Diff](https://github.com/skatejs/dom-diff)
* [Mithril: A Javascript Framework for Building Brilliant Applications](https://github.com/lhorie/mithril.js)
* [Skills Matter Logo](https://skillsmatter.com/explore?q=tag%3Aes6)
* [microscopejs](https://github.com/microscopejs/)
* [Lodash: 10 Javascript Utility Functions That You Should Probably Stop Rewriting](http://colintoh.com/blog/lodash-10-javascript-utility-functions-stop-rewriting)
* [html-template-to-dom](https://github.com/medikoo/html-template-to-dom)
* [Benjamin De Cock - Gists](https://gist.github.com/bendc)
* [ES.next showcase - Showcasing real-world usage of ECMAScript 6 (the next JavaScript version) features](https://github.com/sindresorhus/esnext-showcase)
* [bling.js](https://github.com/stevermeister/bling.js)
* [requestAnimationFrame API: now with sub-millisecond precision](https://developers.google.com/web/updates/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision)
* [requestAnimationFrame for Smart Animating](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)
* [request-frame](https://github.com/julienetie/request-frame)
* [HTML5 2D game development: Graphics and animation, rAf polyfill](http://www.ibm.com/developerworks/library/j-html5-game2/#N101B4)
* [Using requestAnimationFrame](https://css-tricks.com/using-requestanimationframe/)
* [requestanimationframe-fix.js](https://github.com/greggman/requestanimationframe-fix.js)
* [smooth-scroll](https://github.com/tuxsudo/smooth-scroll)
* [micro-tween](https://github.com/JosephClay/micro-tween)
* [tween.js: JavaScript tweening engine for easy animations, incorporating optimised Robert Penner's equations.](https://github.com/tweenjs/tween.js/)
* [Automatos: A CSS Animation library](https://github.com/danreeves/automatos)
* [request-animation-frame-shim](https://github.com/erykpiast/request-animation-frame-shim)
* [Animating Without jQuery](https://www.smashingmagazine.com/2014/09/animating-without-jquery/)
* [Velocity.js](http://julian.com/research/velocity/)
* [paulcpederson/scroll.js](https://gist.github.com/paulcpederson/7f9375b5d66120e5c7b3)
* [MutationObserver API](https://davidwalsh.name/mutationobserver-api)
* [Detect, Undo And Redo DOM Changes With Mutation Observers](https://addyosmani.com/blog/mutation-observers/)
* [Using Mutation Observers to Watch for Element Availability](http://ryanmorr.com/using-mutation-observers-to-watch-for-element-availability/)
* [polyfill-custom-event, es6](https://github.com/tuxsudo/polyfill-custom-event)
* [Cross-browser CustomEvent constructor, polyfill](https://github.com/webmodules/custom-event)
* [How to Create Custom Events in JavaScript](http://www.sitepoint.com/javascript-custom-events/)
* [JavaScript CustomEvent](https://davidwalsh.name/customevent)
* [Capture and report JavaScript errors with window.onerror](http://blog.getsentry.com/2016/01/04/client-javascript-reporting-window-onerror.html)
* [Lose the jQuery Bloat ­— DOM Manipulation with NodeList.js](http://www.sitepoint.com/dom-manipulation-with-nodelist-js/)
* [NodeList.js](https://github.com/eorroe/NodeList.js)
* [Stop Writing Slow Javascript](http://ilikekillnerds.com/2015/02/stop-writing-slow-javascript/)
* [Creating Cross Browser HTML5 Forms Now, Using modernizr, webforms2 and html5Forms](http://www.useragentman.com/blog/2010/07/27/creating-cross-browser-html5-forms-now-using-modernizr-webforms2-and-html5widgets-2/)
* [Cross Browser HTML5 Progress Bars In Depth](http://www.useragentman.com/blog/2012/01/03/cross-browser-html5-progress-bars-in-depth/)
* [dialog-polyfill.js is a polyfill for &lt;dialog&gt;](https://github.com/GoogleChrome/dialog-polyfill)
* [dialog element demo](http://demo.agektmr.com/dialog/)
* [HTML5 Dialog tag with polyfill](http://codepen.io/getonlineamit/pen/LCbop)
* [ShowModalDialog Polyfill](https://github.com/niutech/showModalDialog)
* [Native Modal Windows in HTML5: Using the dialog Element](http://thenewcode.com/957/Native-Modal-Windows-in-HTML5-Using-the-dialog-Element)
* [nwxforms](https://github.com/dperini/nwxforms)
* [The H5F library, emulate the HTML5 forms chapter](http://www.thecssninja.com/javascript/H5F)
* [H5F: a JavaScript library that allows you to use the HTML5 Forms](https://github.com/ryanseddon/H5F)
* [Web Experience Toolkit, Collaborative open source project led by the Government of Canada](https://github.com/wet-boew)
* [Web Experience Toolkit: polyfills](http://wet-boew.github.io/wet-boew/docs/ref/polyfills-en.html)
* [WEBSHIMS LIB: POLYFILL ONLY THE INCAPABLE BROWSERS](http://tests-anciens.ljouhet.net/webshims/demos/details.html)
* [details polyfill](http://blog.mxstbr.com/2015/06/html-details/)
* [Making A Complete Polyfill For The HTML5 Details Element](https://www.smashingmagazine.com/2014/11/complete-polyfill-html5-details-element/)
* [Feature Detection and Styling For The HTML5 details Element](http://thenewcode.com/680/Feature-Detection-and-Styling-For-The-HTML5-details-Element)
* [CSS Script: Simple Free JavaScript / CSS / CSS3 / HTML5 codes to make your life easier.](http://www.cssscript.com/)
* [CSS Script: Accordion](http://www.cssscript.com/categories/accordion/)
* [18 Best HTML5 CSS3 Accordion Tabs and Menus](http://designscrazed.org/html5-css3-accordion-tabs/)
* [Fancy FAQ page using CSS3 only](http://red-team-design.com/fancy-faq-page-using-css3-only/)


