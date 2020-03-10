"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chaff_1 = __importDefault(require("@wiwo/chaff"));
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
        this.Mock = new chaff_1.default.Mock(Person);
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
                var person = new chaff_1.default.Mock(Person).ConstructWith([4, "Adam"]).Create();
                expect(person.Age).toBe(4);
                expect(person.GetName()).toBe("Adam");
            });
        });
        describe("Generic Chaff Tests", function () {
            it("Should return a object with no 'With' call", function () {
                var person = new chaff_1.default.Mock(Person).Create();
                expect(person).toNotBe(null);
                expect(person).toNotBe(undefined);
                expect(person.Age).toBe(undefined);
                expect(person.GetName()).toBe(undefined);
            });
        });
        describe("methods", function () {
            describe("#of", function () {
                it("Should return a new Mock", function () {
                    var mock = chaff_1.default.of(Person);
                    expect(mock).toBeA(chaff_1.default.Mock);
                    expect(mock.Create()).toBeA(Person);
                });
            });
            describe("#wrap", function () {
                it("Should wrap an instance with a Mock", function () {
                    var inst = "INSTANCE";
                    var mock = chaff_1.default.wrap(inst);
                    expect(mock).toBeA(chaff_1.default.Mock);
                    expect(mock.Create()).toBe(inst);
                });
                it("Should return the same Mock", function () {
                    var mockOrig = new chaff_1.default.Mock(Person);
                    var mock = chaff_1.default.wrap(mockOrig);
                    expect(mock).toBe(mockOrig);
                    expect(mock.Create()).toBeA(Person);
                    expect(mock.Create()).toBe(mockOrig.Create());
                });
            });
            describe("#unwrap", function () {
                it("Should unwrap an instance from a Mock", function () {
                    var inst = {};
                    var mock = chaff_1.default.wrap(inst);
                    var result = chaff_1.default.unwrap(mock);
                    expect(result).toBe(inst);
                    expect(mock.Create()).toBe(inst);
                });
                it("Should return the same instance if not a Mock", function () {
                    var inst = {};
                    var result = chaff_1.default.unwrap(inst);
                    expect(inst).toNotBeA(chaff_1.default.Mock);
                    expect(inst).toBe(result);
                    expect(inst).toNotBe(null);
                });
            });
            it("Should define alias methods", function () {
                expect(chaff_1.default.w).toBe(chaff_1.default.wrap);
                expect(chaff_1.default.Mock.w).toBe(chaff_1.default.wrap);
                expect(chaff_1.default.Mock.wrap).toBe(chaff_1.default.wrap);
                expect(chaff_1.default.u).toBe(chaff_1.default.unwrap);
                expect(chaff_1.default.Mock.u).toBe(chaff_1.default.unwrap);
                expect(chaff_1.default.Mock.unwrap).toBe(chaff_1.default.unwrap);
                expect(chaff_1.default.Mock.of).toBe(chaff_1.default.of);
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
