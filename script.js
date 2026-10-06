/* =========================================================
   ISA WU — THRESHOLD / THREE SPACES
========================================================= */

const body = document.body;
const main = document.getElementById("top");

const thresholdOverlay = document.getElementById("threshold-overlay");
const thresholdDot = document.getElementById("threshold-dot");
const cursorLight = document.getElementById("cursor-light");

const cosmicField = document.getElementById("cosmic-field");
const projects = document.getElementById("projects");
const writing = document.getElementById("writing");
const finalSpace = document.getElementById("final-space");

const cosmicGalleries = document.querySelectorAll(".cosmic-gallery");
const cosmicGateway = document.getElementById("cosmic-gateway");

const closingDot = document.getElementById("closing-dot");

const indexButton = document.getElementById("indexButton");
const indexMenu = document.getElementById("indexMenu");

let thresholdOpened = false;


/* =========================================================
   MOBILE INDEX
========================================================= */

if (indexButton && indexMenu) {

    indexButton.addEventListener("click", () => {
        indexMenu.classList.toggle("open");
    });

    indexMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            indexMenu.classList.remove("open");
        });
    });

}


/* =========================================================
   CURSOR LIGHT
========================================================= */

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let lightX = mouseX;
let lightY = mouseY;


window.addEventListener("mousemove", (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

});


function animateCursorLight() {

    if (cursorLight) {

        lightX += (mouseX - lightX) * 0.08;
        lightY += (mouseY - lightY) * 0.08;

        cursorLight.style.left = `${lightX}px`;
        cursorLight.style.top = `${lightY}px`;

    }

    requestAnimationFrame(
        animateCursorLight
    );

}


animateCursorLight();


/* =========================================================
   THRESHOLD ENTRY
========================================================= */

function enterThreshold() {

    if (thresholdOpened) return;

    thresholdOpened = true;

    body.classList.add(
        "threshold-entering"
    );


    setTimeout(() => {

        body.classList.add(
            "threshold-complete"
        );


        if (main) {

            main.setAttribute(
                "data-site-state",
                "cosmic"
            );

        }


        body.setAttribute(
            "data-threshold-depth",
            "1"
        );

    }, 1050);


    setTimeout(() => {

        if (thresholdOverlay) {

            thresholdOverlay.style.pointerEvents =
                "none";

        }


        body.classList.remove(
            "threshold-entering"
        );

    }, 1700);

}


if (thresholdDot) {

    thresholdDot.addEventListener(
        "click",
        enterThreshold
    );


    thresholdDot.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                enterThreshold();

            }

        }
    );

}


/* =========================================================
   COSMIC GALLERY
   Every photographic theme is its own independent book.
   Each book turns horizontally, one image at a time.
========================================================= */

function setupCosmicGallery(gallery) {

    let galleryDragging = false;

    let galleryDragStartX = 0;
    let galleryScrollStart = 0;


    function slideWidth() {

        return gallery.clientWidth;

    }


    function currentSlide() {

        const width =
            slideWidth();


        if (!width) return 0;


        return Math.round(
            gallery.scrollLeft / width
        );

    }


    function snapToCurrentSlide() {

        const width =
            slideWidth();


        if (!width) return;


        const index =
            currentSlide();


        gallery.scrollTo({

            left:
                index * width,

            behavior:
                "smooth"

        });

    }


    /* -----------------------------------------
       Mouse wheel / trackpad
    ----------------------------------------- */

    gallery.addEventListener(
        "wheel",
        (event) => {

            if (
                Math.abs(event.deltaY) <=
                Math.abs(event.deltaX)
            ) {

                return;

            }


            event.preventDefault();


            const direction =
                event.deltaY > 0
                    ? 1
                    : -1;


            const nextIndex =
                currentSlide() +
                direction;


            const slides =
                gallery.querySelectorAll(
                    ".cosmic-gallery-slide"
                );


            if (!slides.length) {
                return;
            }


            const safeIndex =
                Math.max(
                    0,
                    Math.min(
                        nextIndex,
                        slides.length - 1
                    )
                );


            gallery.scrollTo({

                left:
                    safeIndex *
                    slideWidth(),

                behavior:
                    "smooth"

            });

        },
        {
            passive: false
        }
    );


    /* -----------------------------------------
       Pointer drag
    ----------------------------------------- */

    gallery.addEventListener(
        "pointerdown",
        (event) => {

            galleryDragging = true;

            galleryDragStartX =
                event.clientX;

            galleryScrollStart =
                gallery.scrollLeft;


            gallery.classList.add(
                "is-dragging"
            );


            gallery.setPointerCapture(
                event.pointerId
            );

        }
    );


    gallery.addEventListener(
        "pointermove",
        (event) => {

            if (!galleryDragging) {
                return;
            }


            const distance =
                event.clientX -
                galleryDragStartX;


            gallery.scrollLeft =
                galleryScrollStart -
                distance;

        }
    );


    function stopGalleryDrag() {

        if (!galleryDragging) {
            return;
        }


        galleryDragging = false;


        gallery.classList.remove(
            "is-dragging"
        );


        snapToCurrentSlide();

    }


    gallery.addEventListener(
        "pointerup",
        stopGalleryDrag
    );


    gallery.addEventListener(
        "pointercancel",
        stopGalleryDrag
    );


    gallery.addEventListener(
        "pointerleave",
        () => {

            if (galleryDragging) {
                stopGalleryDrag();
            }

        }
    );


    /* -----------------------------------------
       Current slide state
    ----------------------------------------- */

    gallery.addEventListener(
        "scroll",
        () => {

            const index =
                currentSlide();


            gallery
                .querySelectorAll(
                    ".cosmic-gallery-slide"
                )
                .forEach(
                    (slide, i) => {

                        slide.classList.toggle(
                            "is-current",
                            i === index
                        );

                    }
                );

        },
        {
            passive: true
        }
    );


    /* -----------------------------------------
       Keep slide aligned on resize
    ----------------------------------------- */

    window.addEventListener(
        "resize",
        () => {

            const width =
                slideWidth();


            if (!width) {
                return;
            }


            gallery.scrollTo({

                left:
                    currentSlide() *
                    width,

                behavior:
                    "auto"

            });

        }
    );

}


/* =========================================================
   INITIALIZE ALL COSMIC BOOKS
========================================================= */

cosmicGalleries.forEach(
    setupCosmicGallery
);


/* =========================================================
   COSMIC GATEWAY -> PROJECTS
========================================================= */

if (cosmicGateway) {

    cosmicGateway.addEventListener(
        "click",
        () => {

            if (
                !thresholdOpened ||
                body.classList.contains(
                    "gateway-opening"
                )
            ) {

                return;

            }


            body.classList.add(
                "gateway-opening"
            );


            setTimeout(() => {

                if (projects) {

                    projects.scrollIntoView({

                        behavior:
                            "auto",

                        block:
                            "start"

                    });

                }

            }, 700);


            setTimeout(() => {

                body.classList.remove(
                    "gateway-opening"
                );

            }, 1250);

        }
    );

}


/* =========================================================
   UNIT STATE + SIDEBAR
========================================================= */

const unitLinks =
    document.querySelectorAll(
        "[data-unit-link]"
    );


const unitSections = [

    {
        element:
            cosmicField,

        state:
            "cosmic",

        depth:
            "1"
    },

    {
        element:
            projects,

        state:
            "projects",

        depth:
            "2"
    },

    {
        element:
            writing,

        state:
            "writing",

        depth:
            "3"
    },

    {
        element:
            finalSpace,

        state:
            "final",

        depth:
            "4"
    }

];


function setActiveUnit(
    state,
    depth
) {

    if (main) {

        main.setAttribute(
            "data-site-state",
            state
        );

    }


    body.setAttribute(
        "data-threshold-depth",
        depth
    );


    unitLinks.forEach(
        (link) => {

            link.classList.toggle(
                "is-active",
                link.dataset.unitLink === state
            );

        }
    );

}


if (unitSections.length) {

    const unitObserver =
        new IntersectionObserver(

            (entries) => {

                const visible =
                    entries
                        .filter(
                            (entry) =>
                                entry.isIntersecting
                        )
                        .sort(
                            (a, b) =>
                                b.intersectionRatio -
                                a.intersectionRatio
                        );


                if (
                    !visible.length ||
                    !thresholdOpened
                ) {

                    return;

                }


                const target =
                    visible[0].target;


                const found =
                    unitSections.find(
                        (unit) =>
                            unit.element === target
                    );


                if (found) {

                    setActiveUnit(
                        found.state,
                        found.depth
                    );

                }

            },
            {
                threshold: [
                    0.2,
                    0.45,
                    0.7
                ]
            }
        );


    unitSections.forEach(
        (unit) => {

            if (unit.element) {

                unitObserver.observe(
                    unit.element
                );

            }

        }
    );

}


/* =========================================================
   WRITING FLOAT
========================================================= */

const writingFragments =
    document.querySelectorAll(
        ".writing-fragment"
    );


if (writingFragments.length) {

    window.addEventListener(
        "mousemove",
        (event) => {

            if (!writing) {
                return;
            }


            const rect =
                writing.getBoundingClientRect();


            const inWriting =
                rect.top <
                    window.innerHeight &&
                rect.bottom >
                    0;


            if (!inWriting) {
                return;
            }


            const x =
                event.clientX /
                window.innerWidth -
                0.5;


            const y =
                event.clientY /
                window.innerHeight -
                0.5;


            writingFragments.forEach(
                (fragment, index) => {

                    const strength =
                        2 + index * 0.7;


                    const moveX =
                        x * strength;


                    const moveY =
                        y * strength;


                    fragment.style.transform =
                        `translate3d(
                            ${moveX}px,
                            ${moveY}px,
                            0
                        )`;

                }
            );

        }
    );

}


/* =========================================================
   CLOSING THRESHOLD -> RETURN DIRECTLY
   Final white point -> first white point
========================================================= */

if (closingDot) {

    closingDot.addEventListener(
        "click",
        () => {

            if (indexMenu) {
                indexMenu.classList.remove("open");
            }


            /* -----------------------------------------
               Reset gallery positions
               ----------------------------------------- */

            cosmicGalleries.forEach((gallery) => {

                gallery.scrollTo({
                    left: 0,
                    behavior: "auto"
                });

            });


            /* -----------------------------------------
               Reset all visual states
               ----------------------------------------- */

            body.classList.remove(
                "threshold-complete",
                "threshold-entering",
                "gateway-opening"
            );


            thresholdOpened = false;


            if (thresholdOverlay) {

                /*
                    Make the Threshold appear immediately.
                    No fade-out / fade-in delay here.
                */

                thresholdOverlay.style.transition = "none";

                thresholdOverlay.style.pointerEvents =
                    "auto";


                /* Force browser to apply the reset immediately */

                void thresholdOverlay.offsetWidth;


                /* Restore normal transition for the next entry */

                requestAnimationFrame(() => {

                    thresholdOverlay.style.transition = "";

                });

            }


            /* -----------------------------------------
               Reset main site state
               ----------------------------------------- */

            if (main) {

                main.setAttribute(
                    "data-site-state",
                    "threshold"
                );

            }


            body.setAttribute(
                "data-threshold-depth",
                "0"
            );


            /* -----------------------------------------
               Reset sidebar state
               ----------------------------------------- */

            unitLinks.forEach((link) => {

                link.classList.remove(
                    "is-active"
                );

            });


            /* -----------------------------------------
               Jump directly to the beginning
               ----------------------------------------- */

            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "auto"
            });

        }
    );

}


/* =========================================================
   INITIAL STATE
========================================================= */

if (main) {

    main.setAttribute(
        "data-site-state",
        "threshold"
    );

}


body.setAttribute(
    "data-threshold-depth",
    "0"
);


window.scrollTo(
    0,
    0
);
