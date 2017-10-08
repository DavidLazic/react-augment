# react-augment [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

[![NPM version][npm-image]][npm-url]


> Augment your React component with multiple Higher Order Components

## Installation

```bash
npm install react-augment --save
```

## Why

When you're working with Higher Order Components, most general approach to augment a Component is to invoke a HOC and pass the Component as an argument.

```javascript
import { someHOC } from 'someHOC';

class Example extends Component () {}

export default someHOC(Component);
````

In case of two or more HOCs, you can set them up in the following way:

```javascript
import { someHOC } from 'someHOC';
import { someOtherHOC } from 'someOtherHOC';

class Example extends Component () {}

export default someHOC(someOtherHOC(Component));
```

What `react-augment` enables you to do is to augment your Component by composing multiple HOCs in a more robust, lexical way.

```javascript
import { augmentComponent } from 'react-augment';

import { someHOC } from 'someHOC';
import { someOtherHOC } from 'someOtherHOC';

@augmentComponent([
    someHOC,
    someOtherHOC
])
export default class Example extends Component {}
```

## Usage

`@augmentComponent`

> @augmentComponent([HOC, HOC], {})

| Params | Type   | Description |
| ------ |:------:| ----------- |
| HOCS   | Array  | Array of HOCs to be used for augmenting Component.
| params | Object | Optional object to be passed as a second argument to the invoking HOC.


`Augment`

| Methods   | Description |
| --------- | ----------- |
| register  | Register your HOCS to be used globally as annotations.
| component | No-decorator approach method.
| list      | Returns all registered HOC annotations.

> Augment.register({ 'HOC': HOC })

| Params | Type    | Description |
| ------ |:-------:| ----------- |
| HOCS   | Object  | Config object containing HOCs to be annotated. **Notice:** Config `key` will be used as annotation.

> Augment.component([HOC, HOC], {})

*Same as `@augmentComponent` above*

> Augment.list()


### Example

You'd like to augment your Example component with a HOC that handles navigation
and some other HOC.

```javascript
|-- components/
    |-- Example.js

|-- containers/
    |-- hoc/
        |-- index.js
        |-- useNavigation.js
        |-- someOtherHOC.js

```

```javascript
// components/Example.js

export default class Example extends Component {}
```

```javascript
// containers/hoc/useNavigation.js

import React, { Component } from 'react';
import { browserHistory } from 'react-router';

/**
 * @description
 * Higher order component
 * Component wrapper augmenter used for navigation
 *
 * @param  {Function} WrappedComponent
 * @param {Object} optionalConfig
 * @return {Object}
 * @public
 */
export const useNavigation = (WrappedComponent, optionalConfig) =>
    class UseNavigation extends Component {

        constructor (props) {
            super(props);
            this.onNavigate = this.onNavigate.bind(this);
        }

        /**
         * @description
         * On navigate to route.
         *
         * @param {String} route
         * @return {Function}
         * @public
         */
        onNavigate (route) {
            return browserHistory.push(route);
        }

        render () {
            return (
                <WrappedComponent { ...this.props } navigate={ this.onNavigate } />
            );
        }
    };
```

```javascript
// containers/hoc/index.js

import { useNavigation } from './useNavigation';
import { someOtherHOC } from './someOtherHOC';

export default {
    useNavigation,
    someOtherHOC
};
```

### Import & export

There are two ways you can implement react-augment:
- use `@augmentComponent` decorator
- use `Augment` object.

**Note:** To use a decorator you'll need to install [transform-decorators-legacy](transform-decorators) babel plugin.


**Note:** Order of the HOC is irrelevant

```javascript
import { augmentComponent } from 'react-augment';
import HOC from 'containers/hoc';

@augmentComponent([
    HOC.useNavigation,
    HOC.someOtherHOC
], { optional: 'config that will be passed to a HOC as a second argument' })
export default class Example extends Component {}
```

```javascript
import { Augment } from 'react-augment';
import HOC from 'containers/hoc';

class Example extends Component {}

export default Augment.component(Example, [
    HOC.useNavigation,
    HOC.someOtherHOC
], { optional: 'config will be passed as a second argument to a HOC component' });
```

### Annotation approach

You can register all your HOCs' namespaces at one of the main component wrappers (such as App)

```javascript
import { Augment } from 'react-augment';
import HOC from 'containers/hoc';

Augment.register(HOC);

```

This way you can supply the array of your HOC namespaces so you don't have to import them in each of the components.

**instead of**

```javascript
[
    HOC.useNavigation,
    HOC.someOtherHOC
]
```

**use**

```javascript
[
    'useNavigation',
    'someOtherHOC'
]
```

## Development

### Prerequisites

[Node.js](http://nodejs.org/) >= v4 must be installed.

- Running `npm install` in the components's root directory will install everything you need for development.

- `npm start` will run a development server with the component's demo app at [http://localhost:3000](http://localhost:3000) with hot module reloading.

## Running Tests

- `npm test` will run the tests once.

- `npm run test:coverage` will run the tests and produce a coverage report in `coverage/`.

- `npm run test:watch` will run the tests on every change.

## Building

- `npm run build` will build the component for publishing to npm and also bundle the demo app.

- `npm run clean` will delete built resources.

## License

MIT © [David Lazic]()

[npm-image]: https://badge.fury.io/js/react-augment.svg
[npm-url]: https://npmjs.org/package/react-augment
[transform-decorators]: https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy
