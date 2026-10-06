import * as THREE from 'three'
import gsap from 'gsap'

import vertexShader from './shaders/base.vert?raw'
import fragmentShader from './shaders/base.frag?raw'

export default class ProjectsStage {
  constructor(container) {
    this.container = container

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true,
    })

    this.renderer.setPixelRatio(
      Math.min(1.5, window.devicePixelRatio || 1)
    )

    this.renderer.setSize(
      window.innerWidth,
      window.innerHeight
    )

    this.renderer.domElement.classList.add(
      'projects__canvas'
    )

    this.container.appendChild(
      this.renderer.domElement
    )

    this.scene = new THREE.Scene()

    const {
      innerWidth: width,
      innerHeight: height,
    } = window

    this.camera =
      new THREE.OrthographicCamera(
        -width / 2,
        width / 2,
        height / 2,
        -height / 2,
        -1000,
        1000
      )

    this.camera.position.z = 10

    this.raycaster =
      new THREE.Raycaster()

    this.pointer =
      new THREE.Vector2()

    this.tiles = []
    this.activeObject = null
    this.time = 0

    this.loader =
      new THREE.TextureLoader()

    this.images = [
      ...container.querySelectorAll(
        '.projects__image img'
      ),
    ]

    this.setUpPlanes()
    this.resize()
  }

  setUpPlanes() {
    this.images.forEach((image) => {
      const texture =
        this.loader.load(image.src)

      texture.colorSpace =
        THREE.SRGBColorSpace

      const material =
        new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          transparent: true,

          uniforms: {
            uTexture: {
              value: texture,
            },

            uGrayscaleProgress: {
              value: 0,
            },

            uRippleProgress: {
              value: 0,
            },

            uBlurAmount: {
              value: 0,
            },

            uMouse: {
              value: new THREE.Vector2(
                0.5,
                0.5
              ),
            },

            uTime: {
              value: 0,
            },

            uTextureResolution: {
              value:
                new THREE.Vector2(
                  image.naturalWidth || 1000,
                  image.naturalHeight || 1000
                ),
            },
          },
        })

      const geometry =
        new THREE.PlaneGeometry(
          1,
          1,
          50,
          50
        )

      const mesh =
        new THREE.Mesh(
          geometry,
          material
        )

      mesh.userData = {
        image,
        isBw: false,
        tl: null,
      }

      this.scene.add(mesh)
      this.tiles.push(mesh)

      texture.onUpdate = () => {
        if (
          texture.image &&
          texture.image.width
        ) {
          material.uniforms.uTextureResolution.value.set(
            texture.image.width,
            texture.image.height
          )
        }
      }
    })
  }

  getWorldPositionFromDOM(
    element
  ) {
    const rect =
      element.getBoundingClientRect()

    const xNDC =
      (
        (rect.left + rect.width / 2) /
          window.innerWidth
      ) *
        2 -
      1

    const yNDC =
      -(
        (
          (rect.top + rect.height / 2) /
            window.innerHeight
        ) *
          2 -
        1
      )

    const xWorld =
      xNDC *
      (
        this.camera.right -
        this.camera.left
      ) /
      2

    const yWorld =
      yNDC *
      (
        this.camera.top -
        this.camera.bottom
      ) /
      2

    return new THREE.Vector3(
      xWorld,
      yWorld,
      0
    )
  }

  resize() {
    const {
      innerWidth: width,
      innerHeight: height,
    } = window

    this.camera.left =
      -width / 2

    this.camera.right =
      width / 2

    this.camera.top =
      height / 2

    this.camera.bottom =
      -height / 2

    this.camera.updateProjectionMatrix()

    this.renderer.setSize(
      width,
      height
    )

    this.images.forEach(
      (image, index) => {
        const rect =
          image.getBoundingClientRect()

        const mesh =
          this.tiles[index]

        if (!mesh) return

        mesh.scale.set(
          rect.width,
          rect.height,
          1
        )
      }
    )
  }

  updatePositions() {
    this.images.forEach(
      (image, index) => {
        const mesh =
          this.tiles[index]

        if (!mesh) return

        const rect =
          image.getBoundingClientRect()

        mesh.position.copy(
          this.getWorldPositionFromDOM(
            image
          )
        )

        mesh.scale.set(
          rect.width,
          rect.height,
          1
        )
      }
    )
  }

  pointerFromEvent(event) {
    const rect =
      this.container.getBoundingClientRect()

    this.pointer.x =
      (
        (event.clientX - rect.left) /
          rect.width
      ) *
        2 -
      1

    this.pointer.y =
      -(
        (
          (event.clientY - rect.top) /
            rect.height
        ) *
          2 -
        1
      )
  }

  getIntersection(event) {
    this.pointerFromEvent(event)

    this.raycaster.setFromCamera(
      this.pointer,
      this.camera
    )

    const [intersection] =
      this.raycaster.intersectObjects(
        this.tiles
      )

    return intersection
  }

  resetMaterial(object) {
    if (!object) return

    if (object.userData.tl) {
      object.userData.tl.kill()
    }

    const material =
      object.material

    gsap.timeline({
      defaults: {
        duration: 1,
        ease: 'power2.out',
      },

      onUpdate: () => {
        material.uniforms.uTime.value += 0.08
      },

      onComplete: () => {
        object.userData.isBw = false
        material.uniforms.uGrayscaleProgress.value = 0
        material.uniforms.uRippleProgress.value = 0
      },
    })
      .set(
        material.uniforms.uMouse,
        {
          value:
            new THREE.Vector2(
              0.5,
              0.5
            ),
        },
        0
      )
      .to(
        material.uniforms.uGrayscaleProgress,
        {
          value: 0,
        },
        0
      )
      .to(
        material.uniforms.uRippleProgress,
        {
          keyframes: {
            value: [0, 1, 0],
          },
        },
        0
      )
  }

  onClick(event) {
    const intersection =
      this.getIntersection(
        event
      )

    if (!intersection) return

    const object =
      intersection.object

    if (
      this.activeObject &&
      object !== this.activeObject &&
      this.activeObject.userData.isBw
    ) {
      this.resetMaterial(
        this.activeObject
      )
    }

    this.activeObject = object

    const material =
      object.material

    object.userData.isBw = true

    if (object.userData.tl) {
      object.userData.tl.kill()
    }

    const mouse =
      intersection.uv.clone()

    material.uniforms.uMouse.value =
      mouse

    const tl =
      gsap.timeline({
        defaults: {
          duration: 1.5,
          ease: 'power3.inOut',
        },

        onUpdate: () => {
          material.uniforms.uTime.value += 0.08
        },
      })

    tl.to(
      material.uniforms.uGrayscaleProgress,
      {
        value: 1,
      },
      0
    )

    tl.to(
      material.uniforms.uRippleProgress,
      {
        keyframes: {
          value: [0, 1, 0],
        },
      },
      0
    )

    object.userData.tl = tl
  }

  updateBlur() {
    const centerX =
      window.innerWidth / 2

    const maxDistance =
      window.innerWidth / 2

    this.tiles.forEach(
      (tile) => {
        const worldPosition =
          tile.getWorldPosition(
            new THREE.Vector3()
          )

        const vector =
          worldPosition.clone().project(
            this.camera
          )

        const screenX =
          (
            vector.x * 0.5 +
            0.5
          ) *
          window.innerWidth

        const distance =
          Math.abs(
            screenX - centerX
          )

        const blurAmount =
          THREE.MathUtils.clamp(
            (distance /
              maxDistance) *
              5,
            0,
            5
          )

        gsap.to(
          tile.material.uniforms
            .uBlurAmount,
          {
            value:
              Math.round(
                blurAmount / 2
              ) *
              2,
            duration: 1.5,
            ease: 'power3.out',
            overwrite: true,
          }
        )
      }
    )
  }

  render() {
    this.time += 0.01

    this.tiles.forEach(
      (tile) => {
        tile.material.uniforms.uTime.value =
          this.time
      }
    )

    this.updatePositions()

    this.renderer.render(
      this.scene,
      this.camera
    )
  }

  destroy() {
    this.images.forEach(
      (image) => {
        image.style.opacity = ''
      }
    )

    this.tiles.forEach(
      (tile) => {
        tile.geometry.dispose()
        tile.material.dispose()

        if (
          tile.material.uniforms.uTexture
            .value
        ) {
          tile.material.uniforms.uTexture.value.dispose()
        }
      }
    )

    this.scene.clear()

    this.renderer.dispose()

    if (
      this.renderer.domElement.parentNode
    ) {
      this.renderer.domElement.parentNode.removeChild(
        this.renderer.domElement
      )
    }
  }
}
