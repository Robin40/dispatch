const assert = require('assert');
const { isMatch, isMoreSpecific, pretty } = require('./pattern');

const minPartial = function minPartial(elements, isLess) {
  let candidates = [];
  elements.forEach(e => {
    if (!candidates.some(c => isLess(c, e))) {
      candidates = candidates.filter(c => !isLess(e, c));
      candidates.push(e);
    }
  });
  return candidates;
};

const prettyRule = function prettyRule({ pattern }) {
  return pretty(pattern);
};

const newMultimethod = function newMultimethod() {
  const self = function dispatchArgs(...args) {
    const matchingRules = self.rules.filter(rule =>
      isMatch(rule.pattern, args));
    assert(matchingRules.length >= 1, 'No matching rule');
    
    const mostSpecificRules = minPartial(matchingRules, (a, b) =>
      isMoreSpecific(a.pattern, b.pattern));
    assert(mostSpecificRules.length === 1, 'Most specific rule is ambiguous'
      + '\nCandidates:\n' + mostSpecificRules.map(prettyRule).join('\n'));

    const [ bestRule ] = mostSpecificRules;
    const methodToApply = bestRule.method;
    
    return methodToApply(...args);
  };

  self.rules = [];

  return self;
};

let dp = function dispatch(pattern, name, fn) {
  assert(!fn.name, 'Function must be anonymous');

  let multimethod = dp.multimethod[name];
  if (multimethod == null) {
    multimethod = newMultimethod();
    dp.multimethod[name] = multimethod;
    global[name] = multimethod;
  }

  multimethod.rules.push({ pattern, method: fn });
};

dp.multimethod = {};

module.exports = dp;