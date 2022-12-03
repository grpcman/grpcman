import { useState } from 'react'
import { useRecoilState } from 'recoil'
import atoms from '../atoms'

const grpc = require('@grpc/grpc-js')

const SendRequest = () => {

  const [currentProtoMethodDefinitionKey, setCurrentProtoMethodDefinitionKey] = useRecoilState(atoms.currentProtoMethodDefinitionKey)

  const [requestErrorStr, setRequestErrorStr] = useRecoilState(atoms.requestErrorStr)

  const [responseDataStr, setResponseDataStr] = useRecoilState(atoms.responseDataStr)

  const [grpcObject, setGrpcObject] = useRecoilState(atoms.grpcObject)

  const [currentProtoServiceDefinitionKey, setCurrentProtoServiceDefinitionKey] = useRecoilState(atoms.currentProtoServiceDefinitionKey)

  const [serverAddress, setServerAddress] = useRecoilState(atoms.serverAddress)

  const [requestDataStr, setRequestDataStr] = useRecoilState(atoms.requestDataStr)

  const [preserveLog, setPreserveLog] = useState(false)

  const [requestTimes, setRequestTimes] = useState(1)

  const send = () => {
    console.log('grpcObject', grpcObject)
    console.log('currentProtoServiceDefinitionKey', currentProtoServiceDefinitionKey)

    try {
      const packageName = currentProtoServiceDefinitionKey.split('.')[0]
      console.log('packageName', packageName)

      const serviceName = currentProtoServiceDefinitionKey.split('.')[1]
      console.log('serviceName', serviceName)

      const client = new grpcObject[packageName][serviceName](serverAddress, grpc.credentials.createInsecure())
      console.log('client', client)

      const requestDataJson = JSON.parse(requestDataStr)
      console.log('requestDataJson', requestDataJson)

      client[currentProtoMethodDefinitionKey](requestDataJson, (err: any, response: any) => {
        console.log('err', err)
        if (err) {
          setRequestErrorStr(requestErrorStr => (requestErrorStr + '\n' + JSON.stringify(err.stack)).trim())
        }
        console.log('response', response)
        if (response) {
          setResponseDataStr(responseDataStr => (responseDataStr + '\n' + JSON.stringify(response)).trim())
        }
      })
    } catch (e: any) {
      console.error(e)
      alert(e.message)
    }
  }

  return (
    <fieldset style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <legend>6.Change Options And Send Requests</legend>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>Preserve Response:</div>
        <input
          type={'checkbox'}
          checked={preserveLog}
          style={{ margin: 0 }}
          onChange={(e) => setPreserveLog(!preserveLog)}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div>Request Times:</div>
        <input
          type="number"
          min={1}
          value={requestTimes}
          style={{ margin: 0, width: 80 }}
          onChange={(e) => setRequestTimes(Number.parseInt(e.target.value))}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <button
          disabled={!currentProtoMethodDefinitionKey}
          style={{ margin: 0, flexGrow: 1 }}
          onClick={() => {
            // Request Times 必须大于 0 且不为空
            if (!(requestTimes > 0)) {
              setRequestErrorStr(requestErrorStr => (requestErrorStr + '\n' + 'Request Times 须大于0且不为空').trim())
              return
            }

            // Response Data 是否保留
            if (!preserveLog) {
              setResponseDataStr('')
            }

            // 异步发送请求
            for (let i = 0; i < requestTimes; i++) {
              send()
            }
          }}
        >
          Send Requests
        </button>
      </div>
    </fieldset>
  )
}

export default SendRequest
