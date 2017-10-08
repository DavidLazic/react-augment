import React, { Component } from 'react';

/**
 * @description
 * Higher order component
 * Component wrapper used for navigation
 *
 * @param  {Function} WrappedComponent
 * @return {Object}
 * @public
 */
export const useNavigation = (WrappedComponent = () => null) =>
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
            // navigate fn
        }

        render () {
            return (
                <WrappedComponent { ...this.props } navigate={ this.onNavigate } />
            );
        }
    };
