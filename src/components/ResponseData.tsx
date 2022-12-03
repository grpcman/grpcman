import { useRecoilState } from 'recoil'
import atoms from '../atoms'

const ResponseData = () => {
  const [responseDataStr, setResponseDataStr] = useRecoilState(atoms.responseDataStr)

  return (
    <fieldset>
      <legend>Response Data</legend>
      <textarea
        value={responseDataStr}
        onChange={e => setResponseDataStr(e.target.value)}
      />
    </fieldset>
  )
}

export default ResponseData
