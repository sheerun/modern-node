import test from 'ava'
import hello from './index'

test('supports async functions', async t => {
  var result = await hello('world')
  t.is(result, 'hello world')
})
