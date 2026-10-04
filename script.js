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

const cosmicGallery = document.getElementById("cosmic-gallery");
const cosmicGateway = document.getElementById("cosmic-gateway");

const writingSentinel = document.getElementById("writing-threshold-sentinel");
const writingThreshold = document.getElementById("writing-threshold");

const closingDot = document.getElementById("closing-dot");

const indexButton = document.getElementById("indexButton");
const indexMenu = document.getElementById("indexMenu");

let thresholdOpened = false;
let galleryDragging = false;
let galleryDragStartX = 0;
let galleryScrollStart = 0;
let writingTransitionTriggered = false;


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

    requestAnimationFrame(animateCursorLight);
}

animateCursorLight();


/* =========================================================
   THRESHOLD ENTRY
========================================================= */

function enterThreshold() {
    if (thresholdOpened) return;

    thresholdOpened = true;

    body.classList.add("threshold-entering");

    setTimeout(() => {
        body.classList.add("threshold-complete");

        if (main) {
            main.setAttribute("data-site-state", "cosmic");
        }

        body.setAttribute("data-threshold-depth", "1");
    }, 1050);

    setTimeout(() => {
        if (thresholdOverlay) {
            thresholdOverlay.style.pointerEvents = "none";
        }

        body.classList.remove("threshold-entering");
    }, 1700);
}

if (thresholdDot) {
    thresholdDot.addEventListener("click", enterThreshold);

    thresholdDot.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            enterThreshold();
        }
    });
}


/* =========================================================
   COSMIC GALLERY
   Mouse wheel, trackpad and drag all move horizontally.
========================================================= */

if (cosmicGallery) {

    cosmicGallery.addEventListener("wheel", (event) => {

        if (
            Math.abs(event.deltaY) <=
            Math.abs(event.deltaX)
        ) {
            return;
        }

        event.preventDefault();

        cosmicGallery.scrollBy({
            left: event.deltaY * 1.05,
            behavior: "auto"
        });

    }, {
        passive: false
    });


    cosmicGallery.addEventListener("pointerdown", (event) => {

        galleryDragging = true;

        galleryDragStartX = event.clientX;
        galleryScrollStart = cosmicGallery.scrollLeft;

        cosmicGallery.classList.add("is-dragging");

        cosmicGallery.setPointerCapture(
            event.pointerId
        );

    });


    cosmicGallery.addEventListener("pointermove", (event) => {

        if (!galleryDragging) return;

        const distance =
            event.clientX -
            galleryDragStartX;

        cosmicGallery.scrollLeft =
            galleryScrollStart -
            distance;

    });


    const stopGalleryDrag = () => {

        galleryDragging = false;

        cosmicGallery.classList.remove(
            "is-dragging"
        );

    };


    cosmicGallery.addEventListener(
        "pointerup",
        stopGalleryDrag
    );

    cosmicGallery.addEventListener(
        "pointercancel",
        stopGalleryDrag
    );

    cosmicGallery.addEventListener(
        "pointerleave",
        () => {

            if (galleryDragging) {
                stopGalleryDrag();
            }

        }
    );


    /* Keep slide position clean after resizing */

    window.addEventListener(
        "resize",
        () => {

            const slideWidth =
                cosmicGallery.clientWidth;

            if (!slideWidth) return;

            const index =
                Math.round(
                    cosmicGallery.scrollLeft /
                    slideWidth
                );

            cosmicGallery.scrollLeft =
                index * slideWidth;

        }
    );

}


/* =========================================================
   COSMIC GATEWAY -> PROJECTS
========================================================= */

if (cosmicGateway) {

    cosmicGateway.addEventListener("click", () => {

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
                    behavior: "auto",
                    block: "start"
                });

            }

        }, 700);


        setTimeout(() => {

            body.classList.remove(
                "gateway-opening"
            );

        }, 1250);

    });

}


/* =========================================================
   PROJECTS -> WRITING TRANSITION
   White female body line appears exactly at the threshold.
========================================================= */

if (
    writingSentinel &&
    writingThreshold
) {

    const writingObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (
                        !entry.isIntersecting ||
                        writingTransitionTriggered
                    ) {
                        return;
                    }

                    if (!thresholdOpened) {
                        return;
                    }


                    writingTransitionTriggered =
                        true;


                    writingThreshold.classList.add(
                        "active"
                    );

                    body.classList.add(
                        "writing-entering"
                    );


                    setTimeout(() => {

                        writingThreshold.classList.remove(
                            "active"
                        );

                        body.classList.remove(
                            "writing-entering"
                        );

                    }, 1650);

                });

            },
            {
                threshold: 0.05
            }
        );


    writingObserver.observe(
        writingSentinel
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
        element: cosmicField,
        state: "cosmic",
        depth: "1"
    },

    {
        element: projects,
        state: "projects",
        depth: "2"
    },

    {
        element: writing,
        state: "writing",
        depth: "3"
    },

    {
        element: finalSpace,
        state: "final",
        depth: "4"
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


    unitLinks.forEach((link) => {

        link.classList.toggle(
            "is-active",
            link.dataset.unitLink === state
        );

    });

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


    unitSections.forEach((unit) => {

        if (unit.element) {
            unitObserver.observe(
                unit.element
            );
        }

    });

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
   CLOSING THRESHOLD -> RESET TO FIRST SCREEN
========================================================= */

if (closingDot) {

    closingDot.addEventListener(
        "click",
        () => {

            if (indexMenu) {
                indexMenu.classList.remove(
                    "open"
                );
            }


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            setTimeout(() => {

                body.classList.remove(
                    "threshold-complete",
                    "threshold-entering",
                    "gateway-opening",
                    "writing-entering"
                );


                if (thresholdOverlay) {

                    thresholdOverlay.style.pointerEvents =
                        "auto";

                }


                thresholdOpened = false;

                writingTransitionTriggered =
                    false;


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


                unitLinks.forEach((link) => {

                    link.classList.remove(
                        "is-active"
                    );

                });

            }, 850);

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
