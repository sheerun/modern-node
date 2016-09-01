import test from 'ava'
import hello from './index'

test('supports async functions', async t => {
  const result = await hello('world')
  t.is(result, 'hello world')
})
