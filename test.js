const assert = require('assert');
const { isNaN } = require('./type');
const dispatch = require('./index');

dispatch([0],
'factorial', zero => {
  return 1;
});

dispatch([Number],
'factorial', n => {
  return n * factorial(n-1);
});

dispatch([String],
'factorial', s => {
  return factorial(+s);
});

dispatch([Object],
'factorial', thing => {
  return `${thing}!`;
});

dispatch([NaN],
'factorial', nan => {
  return NaN;
});

assert(factorial(0) === 1);
assert(factorial(1) === 1);
assert(factorial(5) === 120);
assert(factorial('5') === 120);
assert(factorial([3, 2, 4]) === '3,2,4!');
assert(isNaN(factorial('meow')));
assert.throws(() => factorial(null), /No matching rule/);

dispatch([Number, Object],
'describe', (num, obj) => {
  return 'number and object';
});

dispatch([Object, String],
'describe', (obj, str) => {
  return 'object and string';
});

assert(describe(42, {}) === 'number and object');
assert(describe({}, 'foo') === 'object and string');
assert.throws(() => describe(42, 'foo'), /ambiguous/);

dispatch([], 'count', () => 0);
dispatch([Object], 'count', () => 1);
dispatch([Object, Object], 'count', () => 2);
dispatch(Array, 'count', () => '???');

assert(count() === 0);
assert(count(42) === 1);
assert(count(42, 'foo') === 2);
assert(count(42, 'foo', parseInt) === '???');

dispatch([Object], 'is42', whatever => 'nope');
dispatch([42], 'is42', fortyTwo => 'yes');
dispatch([Number], 'is42', otherNumber => 'almost');
dispatch([[Object]], 'is42', arrayOfOne => is42(arrayOfOne[0]) + '?');

assert(is42(42) === 'yes');
assert(is42(33) === 'almost');
assert(is42('foo') === 'nope');
assert(is42([[[42]]]) === 'yes???');

dispatch([x => x < 0], 'fib', x => null);
dispatch([0], 'fib', zero => 0);
dispatch([1], 'fib', one => 1);
dispatch([Number], 'fib', n => fib(n-1) + fib(n-2));

assert(fib(-42) == null);
assert(fib(0) === 0);
assert(fib(1) === 1);
assert(fib(6) === 8);

dispatch([String], 'describe2', x => 'a string');
dispatch([x => x === String], 'describe2', x => 'the String class');

assert(describe2('foo') === 'a string');
assert(describe2(String) === 'the String class');