import './About.css'

export default function About({
  onReturn,
}) {
  return (
    <section
      className="about"
      aria-label="About and Contact"
    >
      <div className="about__content">
        <div className="about__block">
          <span className="about__label">
            About
          </span>

          <p className="about__text">
            I am filmmaker and artist, drawn to
            exploring diverse artistic media and
            their intersections, with a particular
            focus on technofeminism, phenomenology,
            hauntology, and memory.
          </p>
        </div>

        <div className="about__block">
          <span className="about__label">
            Contact
          </span>

          <div className="about__links">
            <a
              href="mailto:isa2605824@gmail.com"
            >
              isa2605824@gmail.com
            </a>

            <a
              href="https://www.instagram.com/nubelit_/"
              target="_blank"
              rel="noreferrer"
            >
              @nubelit_
            </a>
          </div>
        </div>
      </div>

      <div className="about__closing">
        <button
          type="button"
          className="about__threshold"
          aria-label="Return to Threshold"
          onClick={onReturn}
        >
          <span />
        </button>
      </div>
    </section>
  )
}
