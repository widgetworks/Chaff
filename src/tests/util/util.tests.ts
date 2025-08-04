import expect from 'expect';
import { getFunctionType } from '../../Chaff/util.js';

declare var describe;
declare var it;
declare var require;

describe('util tests', () => {
    describe('getFunctionType()', () => {
        it('detects function type', () => {
            const actual = {
              string: getFunctionType('foo'), // => ''
              null: getFunctionType(null), // => ''
              class: getFunctionType(class C {}), // => 'class'
              function: getFunctionType(function f() {}), // => 'function'
              arrow: getFunctionType(() => {}), // => 'arrow'
              async: getFunctionType(async function () {}), // => 'async'
              asyncArrow: getFunctionType(async () => {}), // => 'async'
            };
            expect(actual).toEqual({
                string: '',
                null: '',
                class: 'class',
                function: 'function',
                arrow: 'arrow',
                async: 'async',
                
                // NOTE: this approach can't differentiate between `async function(){}` and `async () => {}`
                asyncArrow: 'async',
            });
        });
    });
});
