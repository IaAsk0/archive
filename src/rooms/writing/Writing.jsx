import {
  useEffect,
  useRef,
} from 'react'

import {
  DualWaveAnimation,
} from './DualWaveAnimation.js'

import './Writing.css'

const writingFragments = [
  '我记得自己诞生在一群跳动的白色粒子之间',
  '世界是黑色的',
  '如同精疲力竭那样的黑白',
  '蕴含多变的活力',
  '记忆里有轻盈飘渺的蚊帐',
  '冰凉的竹椅',
  '竹床',
  '温热的躯体',
]

export default function Writing({
  onEnterAbout,
}) {
  const wrapperRef =
    useRef(null)

  useEffect(() => {
    const wrapper =
      wrapperRef.current

    if (!wrapper) {
      return undefined
    }

    const animation =
      new DualWaveAnimation(
        wrapper,
        {
          waveNumber: 1.05,
          waveSpeed: 1,
        }
      )

    animation.init()

    return () => {
      animation.destroy()
    }
  }, [])

  return (
    <section
      ref={wrapperRef}
      className="writing"
      data-wave-number="1.05"
      data-wave-speed="1"
      aria-label="Writing on My Body"
    >
      <div className="writing__intro">
        <span>
          Writing on My Body
        </span>
      </div>

      <div className="writing__spacer" />

      <div className="dual-wave-wrapper">
        <div className="wave-column wave-column-left">
          {writingFragments.map(
            (text, index) => (
              <div
                className="animated-text"
                key={`left-${index}`}
              >
                {text}
              </div>
            )
          )}
        </div>

        <div
          className="writing__center"
          aria-hidden="true"
        >
          <div className="writing__center-mark" />
        </div>

        <div className="wave-column wave-column-right">
          {writingFragments.map(
            (text, index) => (
              <div
                className="animated-text"
                key={`right-${index}`}
              >
                {text}
              </div>
            )
          )}
        </div>
      </div>

      <div className="writing__closing">
        <p>
          Memory does not stay where we leave it.
        </p>

        <button
          type="button"
          className="writing__gateway"
          aria-label="Continue to About"
          onClick={
            onEnterAbout
          }
        >
          <span />
        </button>
      </div>
    </section>
  )
}
