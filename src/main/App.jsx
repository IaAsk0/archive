import { useState } from 'react'

import Threshold from '../threshold/Threshold.jsx'
import CosmicField from '../rooms/cosmic-field/CosmicField.jsx'
import Projects from '../rooms/projects/Projects.jsx'

export default function App() {
  const [room, setRoom] = useState('threshold')

  if (room === 'threshold') {
    return (
      <Threshold
        onEnter={() => setRoom('cosmic-field')}
      />
    )
  }

  if (room === 'cosmic-field') {
    return (
      <CosmicField
        onEnterProjects={() => setRoom('projects')}
      />
    )
  }

  if (room === 'projects') {
    return (
      <Projects
        onEnterWriting={() => setRoom('writing')}
      />
    )
  }

  return null
}
