declare namespace Chaff {
    interface Constructable<T> {
        new (...args: any[]): T;
    }
    interface ITest<Subject> {
        Mock: Chaff.Mock<Subject>;
    }
    /**
     * Get a mock for the given *instance*
     * i.e. not a constructor, wrap an existing instance in a mock.
     *
     * If the instance is a mock then it
     * is returned, otherwise it is wrapped
     * in a new mock instance.
     */
    function wrap<T>(instance: T | Chaff.Mock<T>): Chaff.Mock<T>;
    var w: typeof wrap;
    /**
     * Unwrap the instance from the given value or Mock.
     */
    function unwrap<T>(instance: T | Chaff.Mock<T>): T;
    var u: typeof unwrap;
    /**
     * Shorthand for `new Chaff.Mock(Type)`
     */
    function of<T>(Type: Constructable<T>): Mock<T>;
    class Mock<T> {
        private ConstructorFunction;
        private CreatedType;
        private Args;
        static w: typeof wrap;
        static wrap: typeof wrap;
        static u: typeof unwrap;
        static unwrap: typeof unwrap;
        static of: typeof of;
        constructor(ConstructorFunction: Constructable<T>);
        With(mutator: (obj: T) => void): Mock<T>;
        ConstructWith(Args: Array<any>): Mock<T>;
        Private(mutator: (obj: any) => void): Mock<T>;
        Create(): T;
        MakeSubject(): T;
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
        private MakeType;
    }
}
export default Chaff;
