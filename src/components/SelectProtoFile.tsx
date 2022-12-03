import { useRecoilState } from 'recoil'
import atoms from '../atoms'
import { useEffect } from 'react'

const protoLoader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')

interface FileWithPath extends File {
  path: string
}

const SelectProtoFile = () => {
  const [protoFilePath, setProtoFilePath] = useRecoilState(atoms.protoFilePath)

  const [requestErrorStr, setRequestErrorStr] = useRecoilState(atoms.requestErrorStr)

  const [protoPackageDefinition, setProtoPackageDefinition] = useRecoilState(atoms.protoPackageDefinition)
  useEffect(() => {
    console.log('protoFilePath', protoFilePath)
    // 空文件路径直接返回
    if (protoFilePath === '') {
      return
    }

    // 文件类型错误直接返回
    if (protoFilePath.split('.').pop() !== 'proto') {
      setRequestErrorStr(requestErrorStr === '' ? '文件类型错误，请选择 proto 文件' : requestErrorStr + '\n' + '文件类型错误，请选择 proto 文件')
      return
    }

    // 解析 proto 文件错误直接返回
    try {
      const protoPackageDefinition = protoLoader.loadSync(protoFilePath)
      console.log('protoPackageDefinition', protoPackageDefinition)
      setProtoPackageDefinition(protoPackageDefinition)
    } catch (err: any) {
      setRequestErrorStr(requestErrorStr === '' ? '文件解析错误，请检查 proto 文件' : requestErrorStr + '\n' + '文件解析错误，请检查 proto 文件')
      return
    }
  }, [protoFilePath])

  const [grpcObject, setGrpcObject] = useRecoilState(atoms.grpcObject)
  useEffect(() => {
    // grpc 加载错误直接返回
    try {
      const grpcObject = grpc.loadPackageDefinition(protoPackageDefinition)
      console.log('grpcObject', grpcObject)
      setGrpcObject(grpcObject)
    } catch (err: any) {
      setRequestErrorStr(requestErrorStr === '' ? 'grpc 加载错误，请检查 proto 文件' : requestErrorStr + '\n' + 'grpc 加载错误，请检查 proto 文件')
      return
    }
  }, [protoPackageDefinition])

  const [protoServiceDefinitionKeyList, setProtoServiceDefinitionKeyList] = useRecoilState(atoms.protoServiceDefinitionKeyList)
  useEffect(() => {
    if (!protoPackageDefinition) {
      return
    }
    const protoServiceDefinitionKeyList = Object.keys(protoPackageDefinition)
    console.log('protoServiceDefinitionKeyList', protoServiceDefinitionKeyList)
    setProtoServiceDefinitionKeyList(protoServiceDefinitionKeyList)
  }, [protoPackageDefinition])

  const [currentProtoServiceDefinitionKey, setCurrentProtoServiceDefinitionKey] = useRecoilState(atoms.currentProtoServiceDefinitionKey)
  useEffect(() => {
    if (protoServiceDefinitionKeyList) {
      setCurrentProtoServiceDefinitionKey(protoServiceDefinitionKeyList[0])
    }
  }, [protoServiceDefinitionKeyList])

  const [protoMethodDefinitionKeyList, setProtoMethodDefinitionKeyList] = useRecoilState(atoms.protoMethodDefinitionKeyList)
  useEffect(() => {
    if (!currentProtoServiceDefinitionKey) {
      return
    }
    const protoMethodDefinitionKeys = Object.keys(protoPackageDefinition[currentProtoServiceDefinitionKey])
    console.log('protoMethodDefinitionKeyList', protoMethodDefinitionKeys)
    setProtoMethodDefinitionKeyList(protoMethodDefinitionKeys)
  }, [currentProtoServiceDefinitionKey])

  const [currentProtoMethodDefinitionKey, setCurrentProtoMethodDefinitionKey] = useRecoilState(atoms.currentProtoMethodDefinitionKey)
  useEffect(() => {
    if (protoMethodDefinitionKeyList) {
      setCurrentProtoMethodDefinitionKey(protoMethodDefinitionKeyList[0])
    }
  }, [protoMethodDefinitionKeyList])

  return (
    <fieldset>
      <legend>2.Select Proto File</legend>
      <input
        type="file"
        onChange={e => {
          if (e.target.files) {
            const f = e.target.files[0]
            const fp = (f as FileWithPath).path
            console.log('fp', fp)
            if (fp) {
              setProtoFilePath(fp)
            }
          }
        }}
      />
    </fieldset>
  )
}

export default SelectProtoFile
