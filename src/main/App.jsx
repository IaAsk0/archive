import Threshold from '../threshold/Threshold.jsx'

export default function App() {
  return (
    <Threshold
      onEnter={() => {
        console.log('threshold works')
      }}
    />
  )
}
