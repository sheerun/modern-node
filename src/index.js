async function hello (props) {
  return await new Promise(resolve => {
    const {name, ...rest} = {name: 'me', ...props}
    setTimeout(() => {
      resolve(`hello ${name}`)
    }, rest.length * 100)
  })
}

export default hello
