export const lib = {
  // 封装异步调用
  asyncCall (client, funcName, ...args) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-unused-vars
      console.log('asyncCall() client[funcName]', client[funcName])
      client[funcName](...args, function (err, response) {
        if (err) {
          reject(err)
          return
        }
        resolve(response)
      })
    })
  },

  // 统一定义grpc调用函数
  async grpcCall (client, funcName, data, meta) {
    return await this.asyncCall(client, funcName, data, meta)
  }
}
