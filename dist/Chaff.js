import { getFunctionType } from './util.js';
var Chaff;
(function (Chaff) {
    /**
     * Get a mock for the given *instance*
     * i.e. not a constructor, wrap an existing instance in a mock.
     *
     * If the instance is a mock then it
     * is returned, otherwise it is wrapped
     * in a new mock instance.
     */
    function wrap(instance) {
        var mock;
        if (instance instanceof Chaff.Mock) {
            mock = instance;
        }
        else {
            mock = new Mock(null);
            mock.CreatedType = instance;
        }
        return mock;
    }
    Chaff.wrap = wrap;
    // Alias `wrap()` to `w()`
    Chaff.w = wrap;
    /**
     * Unwrap the instance from the given value or Mock.
     */
    function unwrap(instance) {
        var result;
        if (instance instanceof Chaff.Mock) {
            result = instance.Create();
        }
        else {
            result = instance;
        }
        return result;
    }
    Chaff.unwrap = unwrap;
    // Alias `unwrap` as `u()`
    Chaff.u = unwrap;
    /**
     * Shorthand for `new Chaff.Mock(Type)`
     */
    function of(Type) {
        return new Mock(Type);
    }
    Chaff.of = of;
    class Mock {
        constructor(ConstructorFunction) {
            this.ConstructorFunction = ConstructorFunction;
        }
        With(mutator) {
            mutator(this.MakeSubject());
            return this;
        }
        ConstructWith(Args) {
            this.Args = Args;
            return this;
        }
        Private(mutator) {
            mutator(this.MakeSubject());
            return this;
        }
        Create() {
            return this.MakeSubject();
        }
        MakeSubject() {
            if (!this.CreatedType) {
                this.CreatedType = this.MakeType(this.Args || []);
            }
            return this.CreatedType;
        }
        /**
         * Construct and return a new instance of the type
         *
         * 2018-09-26
         * Updated to instantiate properly from an arbitrary list of constructor arguments.
         *
         * Previously it would instantiate with `new Constructor()` and then apply the arguments.
         * This would only work if the constructor allowed an empty arg list, and would fail
         * if the constructor *required* arguments.
         *
         * In future we'll be able to use `Reflect.construct`:
         * Reflect.construct(this.ConstructorFunction, Args);
         *
         * 2025-08-04 - yay, it's the future and we can use `Reflect.construct()` to support es6 classes now
         *
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct
         */
        MakeType(Args) {
            let instance;
            const fnType = getFunctionType(this.ConstructorFunction);
            if (fnType === 'class') {
                /**
                 * Invoke like `new ConstructorFunction(...Args)`
                 */
                instance = Reflect.construct(this.ConstructorFunction, Args);
            }
            else {
                /**
                 * ConstructorFunction is some sort of "regular" function (`function(){}`, `() => {}`, or async)
                 *
                 * Invoke the function on the `instance` object
                 */
                instance = Object.create(this.ConstructorFunction.prototype);
                this.ConstructorFunction.apply(instance, Args);
            }
            return instance;
        }
    }
    Mock.w = Chaff.w;
    Mock.wrap = Chaff.wrap;
    Mock.u = Chaff.u;
    Mock.unwrap = Chaff.unwrap;
    Mock.of = Chaff.of;
    Chaff.Mock = Mock;
})(Chaff || (Chaff = {}));
export default Chaff;
