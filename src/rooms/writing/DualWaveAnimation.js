import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export class DualWaveAnimation {
  constructor(wrapper, options = {}) {
    this.wrapper =
      wrapper instanceof Element
        ? wrapper
        : document.querySelector(wrapper)

    const waveNumber =
      this.wrapper?.dataset.waveNumber
        ? parseFloat(
            this.wrapper.dataset.waveNumber
          )
        : 1.15

    const waveSpeed =
      this.wrapper?.dataset.waveSpeed
        ? parseFloat(
            this.wrapper.dataset.waveSpeed
          )
        : 1

    this.config = {
      waveNumber,
      waveSpeed,
      ...options,
    }

    this.currentIndex = -1
    this.resizeHandler = null
    this.scrollTrigger = null
  }

  init() {
    if (!this.wrapper) return

    this.leftColumn =
      this.wrapper.querySelector(
        '.wave-column-left'
      )

    this.rightColumn =
      this.wrapper.querySelector(
        '.wave-column-right'
      )

    if (
      !this.leftColumn ||
      !this.rightColumn
    ) {
      return
    }

    this.leftTexts =
      gsap.utils.toArray(
        this.leftColumn.querySelectorAll(
          '.animated-text'
        )
      )

    this.rightTexts =
      gsap.utils.toArray(
        this.rightColumn.querySelectorAll(
          '.animated-text'
        )
      )

    if (
      !this.leftTexts.length ||
      !this.rightTexts.length
    ) {
      return
    }

    this.leftQuickSetters =
      this.leftTexts.map(
        (text) =>
          gsap.quickTo(
            text,
            'x',
            {
              duration: 0.6,
              ease: 'power4.out',
            }
          )
      )

    this.rightQuickSetters =
      this.rightTexts.map(
        (text) =>
          gsap.quickTo(
            text,
            'x',
            {
              duration: 0.6,
              ease: 'power4.out',
            }
          )
      )

    this.calculateRanges()

    this.setInitialPositions(
      this.leftTexts,
      this.leftRange,
      1
    )

    this.setInitialPositions(
      this.rightTexts,
      this.rightRange,
      -1
    )

    this.setupScrollTrigger()

    this.resizeHandler = () => {
      this.calculateRanges()
    }

    window.addEventListener(
      'resize',
      this.resizeHandler
    )

    this.handleScroll({
      progress: 0,
    })
  }

  calculateRanges() {
    const maxLeftTextWidth =
      Math.max(
        ...this.leftTexts.map(
          (text) =>
            text.offsetWidth
        )
      )

    const maxRightTextWidth =
      Math.max(
        ...this.rightTexts.map(
          (text) =>
            text.offsetWidth
        )
      )

    this.leftRange = {
      minX: 0,
      maxX: Math.max(
        0,
        this.leftColumn
          .offsetWidth -
          maxLeftTextWidth
      ),
    }

    this.rightRange = {
      minX: 0,
      maxX: Math.max(
        0,
        this.rightColumn
          .offsetWidth -
          maxRightTextWidth
      ),
    }
  }

  setInitialPositions(
    texts,
    range,
    multiplier
  ) {
    const rangeSize =
      range.maxX -
      range.minX

    texts.forEach(
      (text, index) => {
        const phase =
          this.config.waveNumber *
            index -
          Math.PI / 2

        const wave =
          Math.sin(phase)

        const progress =
          (wave + 1) / 2

        const x =
          (
            range.minX +
            progress *
              rangeSize
          ) * multiplier

        gsap.set(text, { x })
      }
    )
  }

  setupScrollTrigger() {
    this.scrollTrigger =
      ScrollTrigger.create({
        trigger:
          this.wrapper,

        start:
          'top bottom',

        end:
          'bottom top',

        onUpdate: (self) => {
          this.handleScroll(
            self
          )
        },
      })
  }

  handleScroll(self) {
    const progress =
      self.progress ?? 0

    const focusedIndex =
      this.findClosestToViewportCenter()

    this.updateColumn(
      this.leftTexts,
      this.leftQuickSetters,
      this.leftRange,
      progress,
      focusedIndex,
      1
    )

    this.updateColumn(
      this.rightTexts,
      this.rightQuickSetters,
      this.rightRange,
      progress,
      focusedIndex,
      -1
    )
  }

  updateColumn(
    texts,
    setters,
    range,
    progress,
    focusedIndex,
    multiplier
  ) {
    const rangeSize =
      range.maxX -
      range.minX

    texts.forEach(
      (text, index) => {
        const finalX =
          this.calculateWavePosition(
            index,
            progress,
            range.minX,
            rangeSize
          ) * multiplier

        setters[index](
          finalX
        )

        text.classList.toggle(
          'focused',
          index === focusedIndex
        )
      }
    )
  }

  calculateWavePosition(
    index,
    progress,
    minX,
    range
  ) {
    const phase =
      this.config.waveNumber *
        index +
      this.config.waveSpeed *
        progress *
        Math.PI *
        2 -
      Math.PI / 2

    const wave =
      Math.sin(phase)

    const cycleProgress =
      (wave + 1) / 2

    return (
      minX +
      cycleProgress *
        range
    )
  }

  findClosestToViewportCenter() {
    const viewportCenter =
      window.innerHeight / 2

    let closestIndex = 0
    let minDistance =
      Infinity

    this.leftTexts.forEach(
      (text, index) => {
        const rect =
          text.getBoundingClientRect()

        const elementCenter =
          rect.top +
          rect.height / 2

        const distance =
          Math.abs(
            elementCenter -
              viewportCenter
          )

        if (
          distance <
          minDistance
        ) {
          minDistance =
            distance

          closestIndex =
            index
        }
      }
    )

    return closestIndex
  }

  destroy() {
    this.scrollTrigger?.kill()

    if (
      this.resizeHandler
    ) {
      window.removeEventListener(
        'resize',
        this.resizeHandler
      )
    }

    this.leftTexts?.forEach(
      (text) =>
        gsap.killTweensOf(text)
    )

    this.rightTexts?.forEach(
      (text) =>
        gsap.killTweensOf(text)
    )
  }
}
