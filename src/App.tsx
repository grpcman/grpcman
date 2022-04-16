import './App.css'
import { useRecoilState } from 'recoil'
import atoms from './atoms'
import ServerAddress from './components/ServerAddress'
import SelectProtoFile from './components/SelectProtoFile'
import ServiceDefinition from './components/ServiceDefinition'
import MethodDefinition from './components/MethodDefinition'
import RequestData from './components/RequestData'
import ResponseData from './components/ResponseData'
import RequestError from './components/RequestError'
import { useState } from "react";

const grpc = require('@grpc/grpc-js')

function App() {
    const [serverAddress, setServerAddress] = useRecoilState(atoms.serverAddress)

    const [grpcObject, setGrpcObject] = useRecoilState(atoms.grpcObject)

    const [currentProtoServiceDefinitionKey, setCurrentProtoServiceDefinitionKey] = useRecoilState(atoms.currentProtoServiceDefinitionKey)

    const [currentProtoMethodDefinitionKey, setCurrentProtoMethodDefinitionKey] = useRecoilState(atoms.currentProtoMethodDefinitionKey)

    const [requestDataStr, setRequestDataStr] = useRecoilState(atoms.requestDataStr)

    const [requestTimes, setRequestTimes] = useState(1)

    const [responseDataStr, setResponseDataStr] = useRecoilState(atoms.responseDataStr)

    const [requestErrorStr, setRequestErrorStr] = useRecoilState(atoms.requestErrorStr)

    const handleSendButtonClick = () => {
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
                    setRequestErrorStr(requestErrorStr === '' ? JSON.stringify(err.stack) : requestErrorStr + '\n' + JSON.stringify(err.stack))
                }
                console.log('response', response)
                if (response) {
                    setResponseDataStr(responseDataStr === '' ? JSON.stringify(response) : responseDataStr + '\n' + JSON.stringify(response))
                }
            })
        } catch (e: any) {
            console.error(e)
            alert(e.message)
        }
    }

    return (
        <div style={ { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }>
            <ServerAddress/>
            <SelectProtoFile/>
            <ServiceDefinition/>
            <MethodDefinition/>
            <div style={ { gridColumnStart: 1, gridColumnEnd: 3 } }>
                <RequestData/>
            </div>
            <div style={ { gridColumnStart: 1, gridColumnEnd: 3, display: "flex", alignItems: "center", gap: 10 } }>
                <div>Request Times</div>
                <input type="text" value={ requestTimes } style={ { margin: 0, flexGrow: 1 } }
                       onChange={ (e) => setRequestTimes(Number.parseInt(e.target.value)) }/>
                <button disabled={ !currentProtoMethodDefinitionKey } style={ { margin: 0, flexBasis: 395 } }
                        onClick={ handleSendButtonClick }>Send
                </button>
            </div>
            <ResponseData/>
            <RequestError/>
        </div>
    )
}

export default App
