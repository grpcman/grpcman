import './App.css'
import {useEffect, useState} from 'react'

const protoLoader = require('@grpc/proto-loader')

function App() {
    const [protoFilePath, setProtoFilePath] = useState<string>('')

    const [protoPackageDefinition, setProtoPackageDefinition] = useState<any>()
    useEffect(() => {
        const protoPackageDefinition = protoLoader.loadSync(protoFilePath)
        console.log('protoPackageDefinition', protoPackageDefinition)
        setProtoPackageDefinition(protoPackageDefinition)
    }, [protoFilePath])

    const [protoServiceDefinitionKeyList, setProtoServiceDefinitionKeyList] = useState<string[]>([])
    useEffect(() => {
        if (!protoPackageDefinition) {
            return
        }
        const protoServiceDefinitionKeyList = Object.keys(protoPackageDefinition)
        console.log('protoServiceDefinitionKeyList', protoServiceDefinitionKeyList)
        setProtoServiceDefinitionKeyList(protoServiceDefinitionKeyList)
    }, [protoPackageDefinition])

    const [currentProtoServiceDefinitionKey, setCurrentProtoServiceDefinitionKey] = useState<string>('')
    useEffect(() => {
        if (protoServiceDefinitionKeyList) {
            setCurrentProtoServiceDefinitionKey(protoServiceDefinitionKeyList[0])
        }
    }, [protoServiceDefinitionKeyList])

    const [protoMethodDefinitionKeyList, setProtoMethodDefinitionKeyList] = useState<string[]>([])
    useEffect(() => {
        if (!currentProtoServiceDefinitionKey) {
            return
        }
        const protoMethodDefinitionKeys = Object.keys(protoPackageDefinition[currentProtoServiceDefinitionKey])
        console.log('protoMethodDefinitionKeyList', protoMethodDefinitionKeys)
        setProtoMethodDefinitionKeyList(protoMethodDefinitionKeys)
    }, [currentProtoServiceDefinitionKey])

    const [currentProtoMethodDefinitionKey, setCurrentProtoMethodDefinitionKey] = useState<string>('')
    useEffect(() => {
        if (protoMethodDefinitionKeyList) {
            setCurrentProtoMethodDefinitionKey(protoMethodDefinitionKeyList[0])
        }
    }, [protoMethodDefinitionKeyList])

    return (
        <div>
            <h1>grpcman</h1>
            <p>🚀 正在施工中 🚀</p>
            <input
                type="file"
                onChange={e => {
                    if (e.target.files) {
                        const f = e.target.files[0]
                        // @ts-ignore
                        const fp = f['path']
                        console.log('fp', fp)
                        if (fp) {
                            setProtoFilePath(fp)
                        }
                    }
                }}
            />

            <fieldset>
                <legend>Service Definition</legend>
                <select
                    value={currentProtoServiceDefinitionKey}
                    onChange={e => setCurrentProtoServiceDefinitionKey(e.target.value)}
                >
                    {protoServiceDefinitionKeyList.map(k => (
                        <option key={k} value={k}>{k}</option>
                    ))}
                </select>
            </fieldset>

            <fieldset>
                <legend>Method Definition</legend>
                <select
                    value={currentProtoMethodDefinitionKey}
                    onChange={e => setCurrentProtoMethodDefinitionKey(e.target.value)}
                >
                    {protoMethodDefinitionKeyList.map(k => (
                        <option key={k} value={k}>{k}</option>
                    ))}
                </select>
            </fieldset>

        </div>
    )
}

export default App
