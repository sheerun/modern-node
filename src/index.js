async function hello(name) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve(`hello ${name}`)
    }, 500)
  })
}

export default hello;
