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
    var Mock = /** @class */ (function () {
        function Mock(ConstructorFunction) {
            this.ConstructorFunction = ConstructorFunction;
        }
        Mock.prototype.With = function (mutator) {
            mutator(this.MakeSubject());
            return this;
        };
        Mock.prototype.ConstructWith = function (Args) {
            this.Args = Args;
            return this;
        };
        Mock.prototype.Private = function (mutator) {
            mutator(this.MakeSubject());
            return this;
        };
        Mock.prototype.Create = function () {
            return this.MakeSubject();
        };
        Mock.prototype.MakeSubject = function () {
            if (!this.CreatedType) {
                this.CreatedType = this.MakeType(this.Args || []);
            }
            return this.CreatedType;
        };
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
        Mock.prototype.MakeType = function (Args) {
            var holder = Object.create(this.ConstructorFunction.prototype);
            this.ConstructorFunction.apply(holder, Args);
            return holder;
        };
        Mock.w = Chaff.w;
        Mock.wrap = Chaff.wrap;
        Mock.u = Chaff.u;
        Mock.unwrap = Chaff.unwrap;
        Mock.of = Chaff.of;
        return Mock;
    }());
    Chaff.Mock = Mock;
})(Chaff || (Chaff = {}));
