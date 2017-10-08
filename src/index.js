
/**
 * @description
 * Utility
 * Annotations local cache
 *
 * @type {Map}
 */
const annotations = new Map();

/**
 * @description
 * Utility
 * Error type handler object
 *
 * @type {Object}
 */
const errors = {
    typeError: prop => (
        `TypeError: Register method invoked with argument type '${prop.invoked}', expected '${prop.expected}'`
    ),
    existenceError: prop => (
        `ExistenceError: Cannot find '${prop.augmenter}' augmenter`
    )
};

/**
 * @description
 * Utility fn
 * Get string representation of the argument type
 *
 * @param  {*} prop
 * @return {String}
 * @private
 */
const getType = prop => Object.prototype.toString.call(prop);

/**
 * @description
 * Utility fn
 * Check if argument is a function
 *
 * @param  {*}  prop
 * @return {Boolean}
 * @private
 */
const isFunction = prop => getType(prop) === '[object Function]';

/**
 * @description
 * Utility fn
 * Check if argument is an object
 *
 * @param  {*}  prop
 * @return {Boolean}
 * @private
 */
const isObject = prop => getType(prop) === '[object Object]';

/**
 * @description
 * Utility fn
 * Check if namespace has been annotated
 *
 * @param  {String}  name
 * @return {Boolean}
 * @private
 */
const isAnnotated = name => annotations.get(name) || null;

/**
 * @description
 * Utility fn
 * Format error representation
 *
 * @param  {String} error
 * @return {Function}
 * @private
 */
const throwError = error => console.error(`[ERR_AUGMENT] ${error}`);

/**
 * @description
 * Utility fn
 * Compose multiple functions and invoke each with the result of the previous one
 * with selected arguments (Component & config)
 *
 * @param  {Array<Function>} fn
 * @return {Function}
 * @private
 */
const compose = (fn, ...rest) =>
    (!rest.length && Boolean(fn)) ?
        fn :
        (Component, ...args) =>
            fn(compose(...rest)(Component, ...args), ...args);

/**
 * @description
 * Utility fn
 * Annotate augmenter functions in local cache map
 *
 * @param  {Object} augmenters
 * @return {Function}
 * @private
 */
const annotate = augmenters =>
    Object.keys(augmenters).map(key =>
        annotations.set(key, augmenters[key]));

/**
 * @description
 * Utility fn
 * Check if augmenter functions have been provided directly
 * or invoke them from the annotation cache
 *
 * @param  {Array} augmenters
 * @return {Function}
 * @private
 */
const resolveAugmenters = augmenters =>
    augmenters.map(augmenter =>
        isFunction(augmenter) ?
            augmenter :
            isAnnotated(augmenter) || throwError(errors.existenceError({
                augmenter
            })));

/**
 * @description
 * Utility fn
 * Merge augmenter functions, Component and optional config object
 *
 * @param  {Function} Component
 * @param  {Array<Function>} augmenters
 * @param  {Object}  props
 * @return {Function}
 * @private
 */
const merge = (Component = () => null, augmenters = [], props = {}) =>
    compose(...resolveAugmenters(augmenters))(Component, props);

/**
 * @description
 * List all registered HOC annotations
 *
 * @return {Object}
 * @public
 */
const list = () => annotations;

/**
 * @description
 * Semantic mask over merge fn
 *
 * @param  {Function} Component
 * @param  {Array<Function>} augmenters
 * @param  {Object}  props
 * @return {Function}
 * @public
 */
const component = (...props) => merge(...props);

/**
 * @description
 * Annotate augmenter functions by storing them in local cache map
 *
 * @param  {Object} augmenters
 * @return {Function}
 * @public
 */
const register = augmenters =>
    isObject(augmenters) ?
        annotate(augmenters) :
        throwError(errors.typeError({
            invoked: getType(augmenters),
            expected: '[object Object]'
        }));

/**
 * @description
 * API
 * Export augmentComponent decorator fn
 *
 * @param  {Array}  augmenters
 * @param  {Object} props
 * @return {Function}
 * @type {Function}
 * @public
 */
export const augmentComponent = (augmenters = [], props = {}) =>
    Component => merge(Component, augmenters, props);

/**
 * @description
 * API
 * Export Augment object with register, component & list methods
 *
 * @type {Object}
 * @public
 */
export const Augment = { register, component, list };
