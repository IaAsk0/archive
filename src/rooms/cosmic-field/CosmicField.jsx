import FlexCarousel from "./FlexCarousel";

import "./CosmicField.css";

const items = [
    {
        src: "/assets/cosmic-field/lost-city/01.jpg",
        alt: "A Lost City Where I Call Home — 01",
        title: "A Lost City Where I Call Home"
    },
    {
        src: "/assets/cosmic-field/lost-city/02.jpg",
        alt: "A Lost City Where I Call Home — 02",
        title: "A Lost City Where I Call Home"
    },
    {
        src: "/assets/cosmic-field/lost-city/03.jpg",
        alt: "A Lost City Where I Call Home — 03",
        title: "A Lost City Where I Call Home"
    }
];

export default function CosmicField() {
    return (
        <section className="cosmic-room">

            <header className="cosmic-room-header">
                <div className="cosmic-room-label">
                    COSMIC FIELD
                </div>

                <p>
                    A field of stillness
                </p>
            </header>

            <div className="cosmic-carousel-wrap">

                <FlexCarousel
                    items={items}
                    preset="liquid"
                    intro="rise"
                    cardHeight={0.5}
                    gap={12}
                    squeeze={0.2}
                    focusOnClick
                    captions
                />

            </div>

        </section>
    );
}
