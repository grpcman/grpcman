import { atom } from 'recoil'

export default {
    serverAddress: atom<string>({
        key: 'serverAddress',
        default: 'grpcmantest.d8s.fun:50051',
    }),
    protoFilePath: atom<string>({
        key: 'protoFilePath',
        default: '',
    }),
    protoPackageDefinition: atom<any>({
        key: 'protoPackageDefinition',
        default: null,
    }),
    grpcObject: atom<any>({
        key: 'grpcObject',
        default: null,
    }),
    protoServiceDefinitionKeyList: atom<string[]>({
        key: 'protoServiceDefinitionKeyList',
        default: [],
    }),
    currentProtoServiceDefinitionKey: atom<string>({
        key: 'currentProtoServiceDefinitionKey',
        default: '',
    }),
    protoMethodDefinitionKeyList: atom<string[]>({
        key: 'protoMethodDefinitionKeyList',
        default: [],
    }),
    currentProtoMethodDefinitionKey: atom<string>({
        key: 'currentProtoMethodDefinitionKey',
        default: '',
    }),
    requestDataStr: atom<string>({
        key: 'requestDataStr',
        default: '{"name": "grpcman"}',
    }),
    requestTimes: atom<number>({
        key: 'requestTimes',
        default: 1,
    }),
    responseDataStr: atom<string>({
        key: 'responseDataStr',
        default: '',
    }),
    requestErrorStr: atom<string>({
        key: 'requestErrorStr',
        default: '',
    }),
}
