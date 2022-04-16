import { useRecoilState } from 'recoil'
import atoms from '../atoms'

const RequestData = () => {
    const [requestDataStr, setRequestDataStr] = useRecoilState(atoms.requestDataStr)

    return (
        <fieldset>
            <legend>Request Data</legend>
            <textarea
                value={ requestDataStr }
                onChange={ e => setRequestDataStr(e.target.value) }
            />
        </fieldset>
    )
}

export default RequestData
