import {
  useEffect,
  useRef,
} from 'react'

import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import ProjectsStage from './ProjectsStage.js'

import './Projects.css'

gsap.registerPlugin(
  Draggable,
  ScrollTrigger
)

const firstImage = (files) => {
  const entries =
    Object.entries(files)

  entries.sort(
    ([a], [b]) =>
      a.localeCompare(
        b,
        undefined,
        { numeric: true }
      )
  )

  return entries[0]?.[1] || ''
}

const lotus =
  import.meta.glob(
    '../../assets/projects/lotus/**/*.{jpg,jpeg,png,webp}',
    {
      eager: true,
      import: 'default',
    }
  )

const letter =
  import.meta.glob(
    '../../assets/projects/letter/**/*.{jpg,jpeg,png,webp}',
    {
      eager: true,
      import: 'default',
    }
  )

const doubleMemory =
  import.meta.glob(
    '../../assets/projects/double-memory/**/*.{jpg,jpeg,png,webp}',
    {
      eager: true,
      import: 'default',
    }
  )

const jiayi =
  import.meta.glob(
    '../../assets/projects/jiayi/**/*.{jpg,jpeg,png,webp}',
    {
      eager: true,
      import: 'default',
    }
  )

const projects = [
  {
    id: '001',
    title: 'Lotus',
    year: '2026',
    type: 'Short film',
    src: firstImage(lotus),
  },
  {
    id: '002',
    title: 'A Letter for Netochka Nezvanova',
    type: 'net art work',
    src: firstImage(letter),
  },
  {
    id: '003',
    title: 'My Double Memory',
    type: 'experimental',
    src: firstImage(doubleMemory),
  },
  {
    id: '004',
    title: 'I Am Not Jiayi',
    type: 'archive / found footage',
    src: firstImage(jiayi),
  },
]

export default function Projects({
  onEnterWriting,
}) {
  const rootRef =
    useRef(null)

  const viewportRef =
    useRef(null)

  const innerRef =
    useRef(null)

  useEffect(() => {
    const root =
      rootRef.current

    const viewport =
      viewportRef.current

    const inner =
      innerRef.current

    if (
      !root ||
      !viewport ||
      !inner
    ) {
      return undefined
    }

    const stage =
      new ProjectsStage(
        viewport
      )

    const render =
      () => {
        stage.render()
      }

    gsap.ticker.add(render)

    const cards = [
      ...inner.querySelectorAll(
        '.projects__image'
      ),
    ]

    let maxScroll = 0
    let draggable
    let scrollTrigger

    const resize = () => {
      const innerWidth =
        inner.scrollWidth

      const viewportWidth =
        window.innerWidth

      maxScroll =
        Math.abs(
          Math.min(
            0,
            viewportWidth -
              innerWidth
          )
        )

      if (draggable) {
        draggable.applyBounds({
          minX:
            -maxScroll,
          maxX: 0,
        })
      }

      stage.resize()

      scrollTrigger?.refresh()
    }

    const setup = () => {
      resize()

      draggable =
        Draggable.create(
          inner,
          {
            type: 'x',

            bounds: {
              minX:
                -maxScroll,
              maxX: 0,
            },

            dragResistance: 0.5,
            edgeResistance: 0.5,

            onDrag() {
              if (
                !scrollTrigger
              ) {
                return
              }

              const progress =
                gsap.utils.normalize(
                  this.maxX,
                  this.minX,
                  this.x
                )

              const scrollPos =
                scrollTrigger.start +
                (
                  scrollTrigger.end -
                  scrollTrigger.start
                ) *
                progress

              window.scrollTo({
                top: scrollPos,
                behavior: 'instant',
              })

              scrollTrigger.scroll(
                scrollPos
              )

              stage.updateBlur()
            },
          }
        )[0]

      scrollTrigger =
        ScrollTrigger.create({
          trigger:
            viewport,

          start:
            'top top',

          end:
            () =>
              `+=${Math.max(
                1,
                2.5 *
                  maxScroll
              )}`,

          pin: true,

          scrub: 0.05,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          onUpdate(self) {
            const x =
              -maxScroll *
              self.progress

            gsap.set(
              inner,
              { x }
            )

            if (
              draggable &&
              !draggable.isDragging
            ) {
              draggable.x = x
              draggable.update()
            }

            stage.updateBlur()
          },
        })

      stage.updateBlur()
    }

    const click =
      (event) => {
        if (
          event.target.closest(
            '.projects__image'
          )
        ) {
          stage.onClick(event)
        }
      }

    root.addEventListener(
      'click',
      click
    )

    window.addEventListener(
      'resize',
      resize
    )

    const ctx =
      gsap.context(
        () => {
          setup()
        },
        root
      )

    return () => {
      ctx.revert()

      gsap.ticker.remove(
        render
      )

      root.removeEventListener(
        'click',
        click
      )

      window.removeEventListener(
        'resize',
        resize
      )

      draggable?.kill()
      scrollTrigger?.kill()

      stage.destroy()
    }
  }, [])

  return (
    <section
      ref={rootRef}
      className="projects"
      aria-label="Projects"
    >
      <div
        ref={viewportRef}
        className="projects__pin"
      >
        <div className="projects__heading">
          <span>Projects</span>
        </div>

        <div
          ref={innerRef}
          className="projects__carousel-inner"
        >
          {projects.map(
            (project) => (
              <article
                className="projects__item"
                key={project.id}
              >
                <div className="projects__image">
                  <img
                    src={project.src}
                    alt={
                      project.title
                    }
                  />

                  <div className="projects__caption">
                    <span className="projects__number">
                      {project.id}
                    </span>

                    <span className="projects__title">
                      {project.title}
                    </span>

                    <span className="projects__meta">
                      {project.year
                        ? `${project.year} / `
                        : ''}
                      {project.type}
                    </span>
                  </div>
                </div>
              </article>
            )
          )}
        </div>

        <div className="projects__hint">
          drag / scroll
        </div>
      </div>

      <div className="projects__gateway-wrap">
        <button
          type="button"
          className="projects__gateway"
          aria-label="Enter Writing on My Body"
          onClick={onEnterWriting}
        >
          <span />
        </button>
      </div>
    </section>
  )
}
