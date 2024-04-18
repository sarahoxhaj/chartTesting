<template>
    <div>
        <nav class="navbar navbar-default navbar-fixed-top" style="background-color: #C4E1D5; height: 3rem;">
            <div class="container d-flex justify-content-center">
                <h5 class="mt-1">Please select all features that apply to the displayed chart.</h5>
            </div>
        </nav>
    </div>

    <div style="display: flex;">
        <div
            style="border: 1px solid #DDD; width: 47rem; height: 30rem; margin-top: 80px; margin-left: 20px; position: relative;">
            <img :src="currentImage" alt="Your Image"
                style="max-width: 100%; max-height: 100%; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;">

            <svg @click="prevImage" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-caret-left-fill" viewBox="0 0 16 16"
                style="position: absolute; top: 110%; left: 45%; transform: translateX(-50%); margin-top: 10px; width: 2rem; height: 2rem;">
                <path
                    d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
            </svg>

            <svg @click="nextImage" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-caret-right-fill" viewBox="0 0 16 16"
                style="position: absolute; top: 110%; left: 50%; transform: translateX(-50%); margin-top: 10px; width: 2rem; height: 2rem;">
                <path
                    d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
            </svg>
            <div style="margin-top: 600px; margin-left: 20px; text-align: left;">
                <p><small>* Nested bar charts are those type of charts where bars overlap one another.</small></p>
                <p style="margin-top: -20px;"><small>* No-gap bar charts are those type of charts where there is little or
                        no distance between bars.</small></p>
            </div>
        </div>

        <div class="form-check" style="margin-top: 80px; margin-left: 80px; text-align: left;">
            <div>
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    Simple bar chart
                </label>
            </div>
            <div style="margin-top: 20px;">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    Dot bar chart
                </label>
            </div>
            <div style="margin-top: 20px;">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    Grouped bar chart
                </label>
            </div>
            <div style="margin-top: 20px;">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    Embellished bar chart
                </label>
            </div>
            <div style="margin-top: 20px;">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    Nested bar chart *
                </label>
            </div>
            <div style="margin-top: 20px;">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    Stacked bar chart
                </label>
            </div>
        </div>
        <div class="form-check" style="margin-top: 60px; margin-left: 90px; text-align: left;">
            <div style="margin-top: 20px;">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    No-gap bar chart *
                </label>
            </div>
            <div style="margin-top: 20px;">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    3D bar chart
                </label>
            </div>
            <div style="margin-top: 20px;">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    Gantt chart
                </label>
            </div>
            <div style="margin-top: 20px;">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    Error bars - bar chart
                </label>
            </div>
            <div style="margin-top: 20px;">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    Box plot
                </label>
            </div>
            <div style="margin-top: 20px;">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                    Radial bar chart
                </label>
            </div>
            <hr style="width: 30rem; margin-left:-300px">

            <div style="display: flex; margin-top: 20px; margin-left: -270px; text-align: left;">
                <div>
                    <div>
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                        <label class="form-check-label" for="flexCheckDefault">
                            missing labels
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                        <label class="form-check-label" for="flexCheckDefault">
                            missing legend
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                        <label class="form-check-label" for="flexCheckDefault">
                            background element
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                        <label class="form-check-label" for="flexCheckDefault">
                            no background element
                        </label>
                    </div>
                </div>
                <div style="margin-left: 100px; margin-top: -12px;">
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                        <label class="form-check-label" for="flexCheckDefault">
                            monochrome
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                        <label class="form-check-label" for="flexCheckDefault">
                            multiple colors
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                        <label class="form-check-label" for="flexCheckDefault">
                            small values
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                        <label class="form-check-label" for="flexCheckDefault">
                            missing values/axes
                        </label>
                    </div>
                </div>
            </div>


        </div>
    </div>

    <div>
        <div class="form-group"
            style="margin-top: -10px; margin-left: 860px; text-align: left; width: 30rem; height: 23rem;">
            <textarea style="resize: none;" id="w3review" name="w3review" rows="4" cols="55"
                placeholder=" comment"></textarea>
        </div>
        <button type="button" class="btn btn-outline-success"
            style="margin-top: -480px; margin-left: 1155px; text-align: left;">
            Submit
        </button>
    </div>
</template>
  
<script>
export default {
    name: "MainView",
    data() {
        return {
            images: [],
            currentIndex: 0,
        };
    },
    computed: {
        currentImage() {
            return this.images[this.currentIndex];
        },
        isFirstImage() {
            return this.currentIndex === 0;
        },
        isLastImage() {
            return this.currentIndex === this.images.length - 1;
        }
    },
    created() {
        this.loadImages();

        const email = sessionStorage.getItem('email');
        if (email) {
            console.log('Email:', email);
        } else {
            console.log('Email not found in session storage');
        }
    },
    methods: {
        loadImages() {
            const context = require.context('@/assets/', false, /\.(png)$/);
            this.images = context.keys().map(key => context(key))
        },
        prevImage() {
            if (!this.isFirstImage) {
                this.currentIndex--;
            }
        },
        nextImage() {
            if (!this.isLastImage) {
                this.currentIndex++;
            }
        }
    }
};
</script> 