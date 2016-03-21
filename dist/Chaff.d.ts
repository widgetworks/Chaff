declare module Chaff {
    interface ITest<Subject> {
        Mock: Chaff.Mock<Subject>;
    }
    class Mock<T> {
        private ConstructorFunction;
        private CreatedType;
        private Args;
        /**
         * Get a mock for the given instance.
         *
         * If the instance is a mock then it
         * is returned, otherwise it is wrapped
         * in a new mock instance.
         */
        static w<T>(instance: T | Chaff.Mock<T>): Chaff.Mock<T>;
        static wrap<T>(instance: T | Chaff.Mock<T>): Chaff.Mock<T>;
        /**
         * Unwrap the instance from the given value or Mock.
         */
        static u<T>(instance: T | Chaff.Mock<T>): T;
        static unwrap<T>(instance: T | Chaff.Mock<T>): T;
        constructor(ConstructorFunction: any);
        With(mutator: (obj: T) => void): Mock<T>;
        ConstructWith(Args: Array<any>): Mock<T>;
        Private(mutator: (obj: any) => void): Mock<T>;
        Create(): T;
        MakeSubject(): T;
        private MakeType(Args?);
    }
}
