import './Threshold.css'

export default function Threshold({ onEnter }) {
  return (
    <section className="threshold">
      <button
        type="button"
        className="threshold__point"
        aria-label="Enter"
        onClick={onEnter}
      >
        <span />
      </button>
    </section>
  )
}
