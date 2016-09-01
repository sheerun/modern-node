async function hello(name) {
  return await new Promise(resolve => {
    setTimeout(() => {
      resolve(`hello ${name}`)
    }, 500)
  })
}

export default hello
