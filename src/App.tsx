import './App.css'
import {useState} from 'react'

function App() {
    const [f, setF] = useState<File>()
    return (
        <div>
            <h1>grpcman</h1>
            <p>🚀 正在施工中 🚀</p>
            <input
                type="file"
                onChange={e => {
                    if (e.target.files) {
                        const f = e.target.files[0]
                        console.log('f', f)
                        setF(f)
                    }
                }}
            />
        </div>
    )
}

export default App
