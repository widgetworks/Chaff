import Chaff from '../Chaff/Chaff.js';
import expect from 'expect';

declare var describe;
declare var it;
declare var require;



class Person {
	private Name: string;
	constructor(public Age: number, name: string) {
		this.Name = name;
	}
	public Older(): number {
	    return this.Age++;
	}
	public GetName():string{
		return this.Name;
	}
}

class ChaffTests implements Chaff.ITest<Person>{
	public Mock = new Chaff.Mock<Person>(Person);

	constructor() {
		describe("Public Properties Tests", () => {
			it("Should Assign 4 to a Persons Age", () => {
				var person = this.Mock.With(x => x.Age = 4).Create();
				expect(person.Age).toBe(4);
			});
		});

		describe("Private Properties Tests", () => {
			it("Should Assign 'Adam' to a Persons Name", () => {
				var person = this.Mock.Private(x => x.Name = "Adam").Create();
				expect(person.GetName()).toBe("Adam");
			});
		});

		describe("Arguments being passed in upon initialisation", () =>{
			it("Should pass the provided args array object into the constructor", () => {
				var person = new Chaff.Mock<Person>(Person).ConstructWith([4, "Adam"]).Create();
				expect(person.Age).toBe(4);
				expect(person.GetName()).toBe("Adam");
			});
		});

        describe("Generic Chaff Tests", () => {
            it("Should return a object with no 'With' call", () => {
                var person = new Chaff.Mock<Person>(Person).Create();
                expect(person).toNotBe(null);
                expect(person).toNotBe(undefined);
                expect(person.Age).toBe(undefined);
                expect(person.GetName()).toBe(undefined);
            })
		})
		
		describe("methods", () => {
			
			describe("#of", () => {
				it("Should return a new Mock", () => {
					var mock = Chaff.of(Person);
					expect(mock).toBeA(Chaff.Mock);
					expect(mock.Create()).toBeA(Person);
				});
			});
			
			
			describe("#wrap", () => {
				
				it("Should wrap an instance with a Mock", () => {
					var inst = "INSTANCE";
					var mock = Chaff.wrap(inst);
					
					expect(mock).toBeA(Chaff.Mock);
					expect(mock.Create()).toBe(inst);
				});
				
				it("Should return the same Mock", () => {
					var mockOrig = new Chaff.Mock(Person);
					var mock = Chaff.wrap(mockOrig);
					
					expect(mock).toBe(mockOrig);
					expect(mock.Create()).toBeA(Person);
					expect(mock.Create()).toBe(mockOrig.Create());
				});
				
			});
			
			
			describe("#unwrap", () => {
				
				it("Should unwrap an instance from a Mock", () => {
					const inst = {};
					const mock = Chaff.wrap(inst);
					const result = Chaff.unwrap(mock);
					
					expect(result).toBe(inst);
					expect(mock.Create()).toBe(inst);
				});
				
				it("Should return the same instance if not a Mock", () => {
					const inst = {};
					const result = Chaff.unwrap(inst);
					
					expect(inst).toNotBeA(Chaff.Mock);
					expect(inst).toBe(result);
					expect(inst).toNotBe(null);
				});
				
			});
			
			
			it("Should define alias methods", () => {
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
}

(() => {
    return new ChaffTests();
})();
