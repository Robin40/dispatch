exports.isNaN = Number.isNaN;

exports.isArray = Array.isArray;

exports.isFunction = function isFunction(value) {
  return typeof value === 'function';
};

exports.isClass = function isClass(value) {
  return typeof value === 'function' &&
    !!value.name && value.name[0] !== value.name[0].toLowerCase();
};

exports.isSubclass = function isSubclass(a, b) {
  return a === b || a.prototype instanceof b;
};

exports.isInstance = function isInstance(value, cls) {
  if (value == null || value.__proto__ == null) { return false; }

  if (value.__proto__.constructor === cls) { return true; }

  return isInstance(value.__proto__, cls);
};