const test = require('node:test');
const assert = require('node:assert/strict');
const { estimateStoneCount } = require('../scripts/tennis-sizing-draft.cjs');

test('stone estimates increase with length and decrease with diamond size', () => {
  for (const size of ['0.05', '0.10', '0.15', '0.20']) {
    assert.ok(estimateStoneCount(18, size) > estimateStoneCount(16, size));
    assert.ok(estimateStoneCount(7, size) > estimateStoneCount(6.5, size));
  }
  assert.ok(estimateStoneCount(16, '0.05') > estimateStoneCount(16, '0.20'));
  assert.throws(() => estimateStoneCount(16, '0.25'));
});
