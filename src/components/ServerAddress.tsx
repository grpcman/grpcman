import { useRecoilState } from 'recoil'
import atoms from '../atoms'

const ServerAddress = () => {
    const [serverAddress, setServerAddress] = useRecoilState(atoms.serverAddress)

    return (
        <fieldset>
            <legend>Server Address</legend>
            <input
                type="text"
                value={ serverAddress }
                onChange={ e => setServerAddress(e.target.value) }
            />
        </fieldset>
    )
}

export default ServerAddress
