async function hello (props) {
  return await new Promise(resolve => {
    resolve('hello world')
  })
}

module.exports = hello
