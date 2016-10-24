async function hello(name) {
  return await new Promise(resolve => {
    const words = { hello: 'hello' }
    const { hello, ...rest } = { world: 'world', ...words }
    setTimeout(() => {
      resolve(`hello ${name}`)
    }, 500)
  })
}

export default hello
