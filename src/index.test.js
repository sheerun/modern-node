import hello from './index'

test('supports async functions', async () => {
  const result = await hello({ name: 'world' })
  expect(result).toBe('hello world')
})

test('supports destructuring', async () => {
  const { foo, ...rest } = { foo: 'bar', fiz: 'fuz' }
  expect(foo).toBe('bar')
  expect(rest).toEqual({ fiz: 'fuz' })
})

test('supports object spread', async () => {
  const primary = { foo: 'zig' }
  const { fiz, foo } = { fiz: 'fuz', foo: 'bar' }
  expect(foo).toEqual('bar')
  expect(fiz).toEqual('fuz')
})
