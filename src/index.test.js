import hello from './index'

test('supports async functions', async () => {
  const result = await hello({ name: 'world' })
  expect(result).toBe('hello world')
})
