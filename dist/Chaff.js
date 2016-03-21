var Chaff;
(function (Chaff) {
    var Mock = (function () {
        function Mock(ConstructorFunction) {
            this.ConstructorFunction = ConstructorFunction;
        }
        /**
         * Get a mock for the given instance.
         *
         * If the instance is a mock then it
         * is returned, otherwise it is wrapped
         * in a new mock instance.
         */
        Mock.w = function (instance) {
            return Mock.wrap(instance);
        };
        Mock.wrap = function (instance) {
            var mock;
            if (instance instanceof Chaff.Mock) {
                mock = instance;
            }
            else {
                mock = new Mock(null);
                mock.CreatedType = instance;
            }
            return mock;
        };
        /**
         * Unwrap the instance from the given value or Mock.
         */
        Mock.u = function (instance) {
            return Mock.unwrap(instance);
        };
        Mock.unwrap = function (instance) {
            var result;
            if (instance instanceof Chaff.Mock) {
                result = instance.Create();
            }
            else {
                result = instance;
            }
            return result;
        };
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
        Mock.prototype.MakeType = function (Args) {
            var holder = new this.ConstructorFunction();
            this.ConstructorFunction.apply(holder, Args);
            return holder;
        };
        return Mock;
    })();
    Chaff.Mock = Mock;
})(Chaff || (Chaff = {}));
