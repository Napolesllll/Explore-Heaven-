// utils/plugins/AutoSlidePlugin.ts
import type { KeenSliderInstance } from "keen-slider";

export function AutoSlidePlugin(slider: KeenSliderInstance) {
    let timeoutId: ReturnType<typeof setTimeout>;
    let mouseOver = false;
    const autoplaySpeed = 4000;

    const clearNextTimeout = () => clearTimeout(timeoutId);

    function nextTimeout() {
        clearNextTimeout();
        if (mouseOver) return;

        timeoutId = setTimeout(() => {
            slider.next();
        }, autoplaySpeed);
    }

    slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
        });

        slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
        });

        nextTimeout();
    });

    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
    slider.on("destroyed", clearNextTimeout);
}
