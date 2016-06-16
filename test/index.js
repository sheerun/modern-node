import test from 'ava'
import hello from '../'

test('greets someone', async t => {
  var result = await hello('world')
  t.is(result, 'hello world')
})
