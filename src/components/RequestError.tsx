import { useRecoilState } from 'recoil'
import atoms from '../atoms'

const RequestError = () => {
    const [requestErrorStr, setRequestErrorStr] = useRecoilState(atoms.requestErrorStr)

    return (
        <fieldset>
            <legend>Error Message</legend>
            <textarea
                value={ requestErrorStr }
                onChange={ e => setRequestErrorStr(e.target.value) }
            />
        </fieldset>
    )
}

export default RequestError
