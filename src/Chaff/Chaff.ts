namespace Chaff {
    export interface Constructable<T> {
        new(...args: any[]): T;
    }
    export interface ITest<Subject> {
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
    export function wrap<T>(instance: T | Chaff.Mock<T>): Chaff.Mock<T> {
        var mock;
        if (instance instanceof Chaff.Mock) {
            mock = instance;
        } else {
            mock = new Mock(null);
            mock.CreatedType = instance;
        }
        return mock;
    }
    
    // Alias `wrap()` to `w()`
    export var w = wrap;


    /**
     * Unwrap the instance from the given value or Mock.
     */
    export function unwrap<T>(instance: T | Chaff.Mock<T>): T {
        var result;
        if (instance instanceof Chaff.Mock) {
            result = instance.Create();
        } else {
            result = instance;
        }
        return result;
    }
    
    // Alias `unwrap` as `u()`
    export var u = unwrap;
    
    
    /**
     * Shorthand for `new Chaff.Mock(Type)`
     */
    export function of<T>(Type: Constructable<T>){
        return new Mock(Type);
    }
    
    
    export class Mock<T> {
        private CreatedType:T;
        private Args:Array<any>;
        
        static w = Chaff.w;
        static wrap = Chaff.wrap;
        static u = Chaff.u;
        static unwrap = Chaff.unwrap;
        static of = Chaff.of;
        
        
        constructor(private ConstructorFunction: Constructable<T>) {}

        public With(mutator:(obj:T)=>void):Mock<T> {
            mutator(this.MakeSubject());
            return this;
        }

        public ConstructWith(Args: Array<any>):Mock<T>{
            this.Args = Args;
            return this;
        }

        public Private(mutator:(obj:any)=>void):Mock<T> {
            mutator(this.MakeSubject());
            return this;
        }

        public Create():T {
            return this.MakeSubject();
        }

        public MakeSubject():T {
            if (!this.CreatedType) {
                this.CreatedType = this.MakeType(this.Args || []);
            }
            return this.CreatedType
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
         * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct
         */
        private MakeType(Args?:Array<any>):T {
            var holder = Object.create(this.ConstructorFunction.prototype);
            this.ConstructorFunction.apply(holder, Args);
            
            return holder;
        }
    }
}

export default Chaff;
