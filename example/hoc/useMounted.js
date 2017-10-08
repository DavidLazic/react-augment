import React, { Component } from 'react';

/**
 * @description
 * Higher order component
 * Component wrapper used for toggling component's mounted state
 *
 * @param  {Function} WrappedComponent
 * @return {Object}
 * @public
 */
export const useMounted = (WrappedComponent = () => null, config) =>
    class UseMounted extends Component {

        constructor (props) {
            super(props);
            this.mounted = false;
        }

        componentDidMount () {
            this.toggleComponentMount(true);
        }

        componentWillUnmount () {
            this.toggleComponentMount(false);
        }

        /**
         * @description
         * Toggle component's mounted state
         *
         * @return {Function<Object>}
         * @private
         */
        toggleComponentMount (mounted) {
            return Object.assign(this, { mounted });
        }

        render () {
            return (
                <WrappedComponent
                    { ...this.props }
                    config={ config }
                    mounted={ this.mounted } />
            );
        }
    };
