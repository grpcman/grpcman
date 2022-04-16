import { useRecoilState } from 'recoil'
import atoms from '../atoms'

const MethodDefinition = () => {
    const [currentProtoMethodDefinitionKey, setCurrentProtoMethodDefinitionKey] = useRecoilState(atoms.currentProtoMethodDefinitionKey)

    const [protoMethodDefinitionKeyList, setProtoMethodDefinitionKeyList] = useRecoilState(atoms.protoMethodDefinitionKeyList)

    return (
        <fieldset>
            <legend>Method Definition</legend>
            <select
                value={ currentProtoMethodDefinitionKey }
                onChange={ e => setCurrentProtoMethodDefinitionKey(e.target.value) }
            >
                { protoMethodDefinitionKeyList.map(k => (
                    <option key={ k } value={ k }>{ k }</option>
                )) }
            </select>
        </fieldset>
    )
}

export default MethodDefinition
