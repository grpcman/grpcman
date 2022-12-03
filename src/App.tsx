import './App.css'
import ServerAddress from './components/ServerAddress'
import SelectProtoFile from './components/SelectProtoFile'
import ServiceDefinition from './components/ServiceDefinition'
import MethodDefinition from './components/MethodDefinition'
import RequestData from './components/RequestData'
import ResponseData from './components/ResponseData'
import RequestError from './components/RequestError'
import SendRequest from './components/SendRequest'

function App() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>

      <ServerAddress/>

      <SelectProtoFile/>

      <ServiceDefinition/>

      <MethodDefinition/>

      <div style={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
        <RequestData/>
      </div>

      <div style={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
        <SendRequest/>
      </div>

      <ResponseData/>

      <RequestError/>

    </div>
  )
}

export default App
