document.addEventListener("alpine:init", () => {
    Alpine.data('program', () => ({
        activeIndex: 1,
        svgColor: null,
        slides: [],
        observer: null,

        init() {
            this.slides = [...document.querySelectorAll(".program__cell-slide")];
            this.setupObserver();
        },

        setupObserver() {
            this.observer = new IntersectionObserver((entries) => {
                let topMostEntry = null;

                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!topMostEntry || entry.boundingClientRect.top < topMostEntry.boundingClientRect.top) {
                            topMostEntry = entry;
                        }
                    }
                });

                if (topMostEntry) {
                    this.handleChangeAttribute(topMostEntry.target);
                }
            }, {
                root: this.$refs.wrapper,
                rootMargin: "-300px 0px -300px 0px",
                threshold: 0.5
            });

            this.slides.forEach(slide => {
                this.observer.observe(slide);
            });
        },

        shouldObserve() {
            return window.innerWidth > 998;
        },

        disconnectObserver() {
            if (this.observer && this.shouldObserve()) {
                this.observer.disconnect();
            }
        },

        reconnectObserver() {
            if (this.observer && this.shouldObserve()) {
                this.slides.forEach(slide => {
                    this.observer.observe(slide);
                });
            }
        },

        handleClickPill(currentPill) {
            this.handleChangeAttribute(currentPill);
            this.disconnectObserver();
            this.scrollToSlide(this.activeIndex);
        },

        scrollToSlide(index) {
            const slide = this.$refs[`slide_${index}`];
            if (slide) {
                slide.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "nearest"
                });

                this.delay(1000).then(() => this.reconnectObserver());
            }
        },

        get isShowMobileSlide() {
            return window.innerWidth > 998 || this.$refs[`slide_${this.activeIndex}`]?.dataset.index == this.activeIndex;
        },

        handleShowSlide(index) {
            this.slides.forEach(slide => slide.classList.remove("program-slide--active"));
            this.$refs[`slide_${index}`]?.classList.add("program-slide--active");
        },

        handleChangeAttribute(element) {
            const { dataset: { index = 1, color = null } } = element;
            this.activeIndex = index;
            this.svgColor = color;
        },

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

    }));
});
