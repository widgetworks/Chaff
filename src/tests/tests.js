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
///<reference path="./../Chaff/Chaff.ts" />
var expect = require('expect');
var Person = /** @class */ (function () {
    function Person(Age, name) {
        this.Age = Age;
        this.Name = name;
    }
    Person.prototype.Older = function () {
        return this.Age++;
    };
    Person.prototype.GetName = function () {
        return this.Name;
    };
    return Person;
}());
var ChaffTests = /** @class */ (function () {
    function ChaffTests() {
        var _this = this;
        this.Mock = new Chaff.Mock(Person);
        describe("Public Properties Tests", function () {
            it("Should Assign 4 to a Persons Age", function () {
                var person = _this.Mock.With(function (x) { return x.Age = 4; }).Create();
                expect(person.Age).toBe(4);
            });
        });
        describe("Private Properties Tests", function () {
            it("Should Assign 'Adam' to a Persons Name", function () {
                var person = _this.Mock.Private(function (x) { return x.Name = "Adam"; }).Create();
                expect(person.GetName()).toBe("Adam");
            });
        });
        describe("Arguments being passed in upon initialisation", function () {
            it("Should pass the provided args array object into the constructor", function () {
                var person = new Chaff.Mock(Person).ConstructWith([4, "Adam"]).Create();
                expect(person.Age).toBe(4);
                expect(person.GetName()).toBe("Adam");
            });
        });
        describe("Generic Chaff Tests", function () {
            it("Should return a object with no 'With' call", function () {
                var person = new Chaff.Mock(Person).Create();
                expect(person).toNotBe(null);
                expect(person).toNotBe(undefined);
                expect(person.Age).toBe(undefined);
                expect(person.GetName()).toBe(undefined);
            });
        });
        describe("methods", function () {
            describe("#of", function () {
                it("Should return a new Mock", function () {
                    var mock = Chaff.of(Person);
                    expect(mock).toBeA(Chaff.Mock);
                    expect(mock.Create()).toBeA(Person);
                });
            });
            describe("#wrap", function () {
                it("Should wrap an instance with a Mock", function () {
                    var inst = "INSTANCE";
                    var mock = Chaff.wrap(inst);
                    expect(mock).toBeA(Chaff.Mock);
                    expect(mock.Create()).toBe(inst);
                });
                it("Should return the same Mock", function () {
                    var mockOrig = new Chaff.Mock(Person);
                    var mock = Chaff.wrap(mockOrig);
                    expect(mock).toBe(mockOrig);
                    expect(mock.Create()).toBeA(Person);
                    expect(mock.Create()).toBe(mockOrig.Create());
                });
            });
            describe("#unwrap", function () {
                it("Should unwrap an instance from a Mock", function () {
                    var inst = {};
                    var mock = Chaff.wrap(inst);
                    var result = Chaff.unwrap(mock);
                    expect(result).toBe(inst);
                    expect(mock.Create()).toBe(inst);
                });
                it("Should return the same instance if not a Mock", function () {
                    var inst = {};
                    var result = Chaff.unwrap(inst);
                    expect(inst).toNotBeA(Chaff.Mock);
                    expect(inst).toBe(result);
                    expect(inst).toNotBe(null);
                });
            });
            it("Should define alias methods", function () {
                expect(Chaff.w).toBe(Chaff.wrap);
                expect(Chaff.Mock.w).toBe(Chaff.wrap);
                expect(Chaff.Mock.wrap).toBe(Chaff.wrap);
                expect(Chaff.u).toBe(Chaff.unwrap);
                expect(Chaff.Mock.u).toBe(Chaff.unwrap);
                expect(Chaff.Mock.unwrap).toBe(Chaff.unwrap);
                expect(Chaff.Mock.of).toBe(Chaff.of);
            });
        });
        // describe("", () => {
        // 	it("", () => {
        // 	});
        // });
    }
    return ChaffTests;
}());
(function () {
    return new ChaffTests();
})();
