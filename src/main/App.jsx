import {
  useEffect,
  useState,
} from 'react'

import Threshold from '../threshold/Threshold.jsx'
import CosmicField from '../rooms/cosmic-field/CosmicField.jsx'
import Projects from '../rooms/projects/Projects.jsx'
import Writing from '../rooms/writing/Writing.jsx'
import About from '../rooms/about/About.jsx'

export default function App() {
  const [room, setRoom] =
    useState('threshold')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [room])

  if (room === 'threshold') {
    return (
      <Threshold
        onEnter={() =>
          setRoom('cosmic-field')
        }
      />
    )
  }

  if (room === 'cosmic-field') {
    return (
      <CosmicField
        onEnterProjects={() =>
          setRoom('projects')
        }
      />
    )
  }

  if (room === 'projects') {
    return (
      <Projects
        onEnterWriting={() =>
          setRoom('writing')
        }
      />
    )
  }

  if (room === 'writing') {
    return (
      <Writing
        onEnterAbout={() =>
          setRoom('about')
        }
      />
    )
  }

  if (room === 'about') {
    return (
      <About
        onReturn={() =>
          setRoom('threshold')
        }
      />
    )
  }

  return null
}
