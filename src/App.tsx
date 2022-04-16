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

    const [protoPackageDefinitionKeys, setProtoPackageDefinitionKeys] = useState<string[]>([])
    useEffect(() => {
        if (!protoPackageDefinition) {
            return
        }
        const protoPackageDefinitionKeys = Object.keys(protoPackageDefinition)
        console.log('protoPackageDefinitionKeys', protoPackageDefinitionKeys)
        setProtoPackageDefinitionKeys(protoPackageDefinitionKeys)
    }, [protoPackageDefinition])

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
            <select>
                {protoPackageDefinitionKeys.map(k => (
                    <option key={k}>{k}</option>
                ))}
            </select>
        </div>
    )
}

export default App
