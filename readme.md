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

import moment from 'moment';
import Person from './js/components/Person.js';

const element = document.querySelector('#container');

const content = document.createElement('h1');
content.classList.add('Person');
content.textContent =
  `${moment().format('YYYY-MM-DD HH:mm:ss')}: Yo ${new Person('Leif', 'Olsen')}`;
element.appendChild(content);
```

### Prøv ut koden
* Åpne et terminalvindu og start utviklingsserveren med følgende kommando: `npm run dev`    
* Åpne nettleseren og naviger til: http://localhost:8080/webpack-dev-server/
* Eventuelle endringer i koden kan du observere fortløpende i terminalvinduet og i nettleseren.
* Stopp serveren med `Ctrl+C`
* Kjør kommandoen `npm run build` og verifiser at `./dist`katalogen inneholder filene `vendor.js` og `app.js`

Dette er i hovedsak utviklingsmiljøet du trenger for å komme i gang med ECMAScript 2015, ES6.

Resten av eksemplet forutsetter at du benytter __Node-4.x__ eller [__Node-5.x__](https://nodejs.org/en/)!


## Konfigurernig av Node og Webpack vha node-config
TODO
 
 
## Minification
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
* [node-sass](https://github.com/sass/node-sass)
* [file-loader](https://github.com/webpack/file-loader)
* [url-loader](https://github.com/webpack/url-loader)
* [extract-text-webpack-plugin](https://github.com/webpack/extract-text-webpack-plugin)
* [autoprefixer](https://github.com/postcss/autoprefixer)
* [postcss-loader](https://github.com/postcss/postcss-loader)

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
    { test: /\.svg/, loader: 'url-loader?limit=16384&mimetype=image/svg' },

    // Fonts
    { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=16384&mimetype=application/font-woff' },
    { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
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

import moment from 'moment';
import Person from './js/components/Person.js';

const element = document.querySelector('#container');

// Content
const content = document.createElement('h1');
content.textContent = content.classList.add('Person');
  `${moment().format('YYYY-MM-DD HH:mm:ss')}: Yo ${new Person('Leif', 'Olsen')}`;
element.appendChild(content);

// Append header, using import html
import header from './html/header.html';
content.insertAdjacentHTML('beforebegin', header);

// Append footer, using require html
content.insertAdjacentHTML('afterend', require('./html/footer.html'));
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
       expect(person.getName()).toBe('Leif Olsen');
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
* [Exploring es6](http://exploringjs.com/es6/) (free book)
* [Understanding ECMAScript 6](https://leanpub.com/understandinges6/read) (free book)
* [ECMAScript 6 Learning](https://github.com/ericdouglas/ES6-Learning)
* [Exploring ES2016 Decorators](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.hrtgi290a)
* [Making the most of JavaScript’s “future” today with Babel](https://strongloop.com/strongblog/javascript-babel-future/)
* [How to Write an Open Source JavaScript Library](https://egghead.io/lessons/javascript-how-to-write-a-javascript-library-introduction)
* [fetch API](https://davidwalsh.name/fetch)
* [window.fetch polyfill](https://github.com/github/fetch)


### Webpack
* [What is webpack](http://webpack.github.io/docs/what-is-webpack.html)
* [Webpack configuration](https://webpack.github.io/docs/configuration.html)
* [WEBPACK 101: AN INTRODUCTION TO WEBPACK](http://code.hootsuite.com/webpack-101/)
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


### CSS/SASS
* [Smarter CSS builds with Webpack](http://bensmithett.com/smarter-css-builds-with-webpack/)
* [Styling React Components In Sass](http://hugogiraudel.com/2015/06/18/styling-react-components-in-sass/)
* [Writing Happy Stylesheets with Webpack](http://jamesknelson.com/writing-happy-stylesheets-with-webpack/)
* [Tutorial – write in ES6 and Sass on the front end with Webpack and Babel](http://tech.90min.com/?p=1340)
* [Webpack CSS Example](https://github.com/bensmithett/webpack-css-example)
* [Faster SASS builds with Webpack](http://eng.localytics.com/faster-sass-builds-with-webpack/)


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
