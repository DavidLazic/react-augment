import React, { Component } from 'react'
import ReactDOM from 'react-dom';

// import Augment
import { Augment, augmentComponent } from '../../src';

// import all higher order components
import HOC from '../../example/hoc';

// Register all the HOC so we can use them for augmentation
// via namespace only throughout the app
Augment.register(HOC);

// List all registered HOC namespaces
console.log(Augment.list());

// Augment component with 2 HOC via decorator
@augmentComponent([
    'useMounted',
    'useNavigation'
], { props: 'test' })
class Demo extends Component {
    render () {
        return (
            <div>
                <h1>react-augment Demo</h1>
                <div>Demo component now uses:</div>
                <div>Navigate prop: { this.props.navigate.toString() } </div>
                <div>Mounted prop: { this.props.mounted.toString() }</div>
                <br />
                <div>And has received config object: { JSON.stringify(this.props.config) }</div>
            </div>
        );
    }
}

ReactDOM.render(<Demo/>, document.querySelector('#demo'));


// Augmenting example if you don't want to use decorators
//
/**

const AugmentedDemo = Augment.component(Demo, [
    'useMounted',
    'useNavigation'
], { props: 'test' })

of you could export it like

ReactDOM.render(<AugmentedDemo/>, document.querySelector('#demo'))

*/
