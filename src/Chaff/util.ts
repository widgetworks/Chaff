/**
 * https://stackoverflow.com/questions/30758961/how-to-check-if-a-variable-is-an-es6-class-declaration/72326559#72326559
 * https://stackoverflow.com/a/69316645/81723
 */
export function getFunctionType(x) {
    let result = '';
    if (typeof x !== 'function'){
        return result;
    }
    
    if (x.prototype){
        if (Object.getOwnPropertyDescriptor(x, 'prototype').writable){
            result = 'function';
        } else {
            result = 'class';
        }
    } else if (x.constructor.name === 'AsyncFunction'){
        result = 'async';
    } else {
        result = 'arrow';
    }
    
    return result;
}
