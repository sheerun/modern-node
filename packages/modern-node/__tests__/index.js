const hello = require('..')

test('supports async functions', async () => {
  const result = await hello({ name: 'world' })
  expect(result).toBe('hello world')
})

test('supports object spread', async () => {
  const primary = { foo: 'zig' }
  const { fiz, foo } = { fiz: 'fuz', foo: 'bar' }
  expect(foo).toEqual('bar')
  expect(fiz).toEqual('fuz')
})
