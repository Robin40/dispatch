const { isNaN, isArray, isFunction, isClass,
        isSubclass, isInstance } = require('./type');

function isPredicate(pattern) {
  return isFunction(pattern) && !isClass(pattern);
};

exports.isMatch = function isMatch(pattern, value) {
  if (isClass(pattern)) {
    return isInstance(value, pattern);
  }

  if (isArray(pattern)) {
    return isArray(value) && value.length === pattern.length &&
      value.every((_, i) => isMatch(pattern[i], value[i]));
  }

  if (isPredicate(pattern)) {
    return pattern(value);
  }

  if (isNaN(pattern) && isNaN(value)) { return true; }
  return value === pattern;
};

exports.isMoreSpecific = function isMoreSpecific(a, b) {
  if (isNaN(a) && isNaN(b)) { return false; }
  if (a === b) { return false; }

  if (isClass(a) && isClass(b)) {
    return isSubclass(a, b);
  }

  if (isArray(a) && isArray(b) && a.length === b.length) {
    return a.some((_, i) => isMoreSpecific(a[i], b[i])) &&
          !a.some((_, i) => isMoreSpecific(b[i], a[i]));
  }

  if (isPredicate(a) && isPredicate(b)) { return false; }

  // value < predicate < class
  // isValue(a) || isPredicate(a) --> !isClass(a)
  // isPredicate(b) || isClass(b) --> isFunction(b)
  if (!isClass(a) && isFunction(b)) { return true; }

  return isInstance(a, b);
};

exports.pretty = function pretty(pattern) {
  if (isClass(pattern)) { return pattern.name; }

  if (isArray(pattern)) {
    return `[${pattern.map(pretty).join(', ')}]`;
  }

  if (isPredicate(pattern)) {
    return pattern.name ||
      (pattern.toSource && pattern.toSource()) ||
        'predicate';
  }

  return `${pattern}`;
};