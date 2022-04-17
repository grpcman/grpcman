import { useRecoilState } from 'recoil'
import atoms from '../atoms'

const ServiceDefinition = () => {
    const [currentProtoServiceDefinitionKey, setCurrentProtoServiceDefinitionKey] = useRecoilState(atoms.currentProtoServiceDefinitionKey)

    const [protoServiceDefinitionKeyList, setProtoServiceDefinitionKeyList] = useRecoilState(atoms.protoServiceDefinitionKeyList)

    return (
        <fieldset>
            <legend>Service Definition</legend>
            <select
                value={ currentProtoServiceDefinitionKey }
                onChange={ e => setCurrentProtoServiceDefinitionKey(e.target.value) }
            >
                { protoServiceDefinitionKeyList.map(k => (
                    <option
                        key={ k }
                        value={ k }
                    >{ k }</option>
                )) }
            </select>
        </fieldset>
    )
}

export default ServiceDefinition
