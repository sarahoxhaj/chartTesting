<template>
    <div>
        <nav class="navbar navbar-default navbar-fixed-top" style="background-color: #C4E1D5; height: 3rem;  width: 90rem;">
            <div class="container d-flex justify-content-center">
                <h5 class="mt-1">Please select all features that apply to the displayed chart.</h5>
                <p v-if="name" style="margin-top: 20px;">Name: {{ name }}</p>
            </div>
        </nav>
        <div style="display: flex;">
            <div
                style="border: 1px solid #DDD; width: 47rem; height: 30rem; margin-top: 60px; margin-left: 20px; position: relative;">
                <img :src="currentImage" alt="Your Image"
                    style="max-width: 100%; max-height: 100%; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;">
                <div>
                    <svg @click="nextImage" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-caret-right-fill" viewBox="0 0 16 16"
                        style="position: absolute; top: 110%; left: 50%; transform: translateX(-50%); margin-top: -10px; width: 2rem; height: 2rem;">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>
                    <p @click="nextImage" style="margin-top: 520px; margin-left: 150px; cursor: default;"><b>{{ isLastImage
                        ? 'Submit result'
                        : 'Next image'
                    }}</b></p>
                </div>
                <div style="margin-top: 25px; margin-left: 20px; text-align: left;">
                    <p><small>* Nested bar charts are those type of charts where bars overlap one another.</small></p>
                    <p style="margin-top: -20px;"><small>* No-gap bar charts are those type of charts where there is little
                            or
                            no distance between bars.</small></p>
                </div>
            </div>

            <div class="form-check" style="margin-top: 60px; margin-left: 80px; text-align: left;">
                <div>
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label">
                        Simple - 1D bar chart
                    </label>
                </div>
                <div style="margin-top: 20px;">
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label">
                        Dot bar chart
                    </label>
                </div>
                <div style="margin-top: 20px;">
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label">
                        Grouped bar chart
                    </label>
                </div>
                <div style="margin-top: 20px;">
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label">
                        Embellished bar chart
                    </label>
                </div>
                <div style="margin-top: 20px;">
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label">
                        Nested bar chart *
                    </label>
                </div>
                <div style="margin-top: 20px;">
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label">
                        Stacked bar chart
                    </label>
                </div>
            </div>
            <div class="form-check" style="margin-top: 40px; margin-left: 90px; text-align: left;">
                <div style="margin-top: 20px;">
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label">
                        No-gap bar chart *
                    </label>
                </div>
                <div style="margin-top: 20px;">
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label">
                        3D bar chart
                    </label>
                </div>
                <div style="margin-top: 20px;">
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label">
                        Gantt chart
                    </label>
                </div>
                <div style="margin-top: 20px;">
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label">
                        Error bars - bar chart
                    </label>
                </div>
                <div style="margin-top: 20px;">
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label">
                        Box plot
                    </label>
                </div>
                <div style="margin-top: 20px;">
                    <input class="form-check-input" type="checkbox" value="">
                    <label class="form-check-label">
                        Radial bar chart
                    </label>
                </div>
                <hr style="width: 30rem; margin-left:-300px">

                <div style="display: flex; margin-top: 20px; margin-left: -270px; text-align: left;">
                    <div>
                        <div>
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">
                                missing labels
                            </label>
                        </div>
                        <div style="margin-top: 10px;">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">
                                missing legend
                            </label>
                        </div>
                        <div style="margin-top: 10px;">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">
                                background element
                            </label>
                        </div>
                        <div style="margin-top: 10px;">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">
                                no background element
                            </label>
                        </div>
                    </div>
                    <div style="margin-left: 100px; margin-top: -12px;">
                        <div style="margin-top: 10px;">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">
                                monochrome
                            </label>
                        </div>
                        <div style="margin-top: 10px;">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">
                                multiple colors
                            </label>
                        </div>
                        <div style="margin-top: 10px;">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">
                                small values
                            </label>
                        </div>
                        <div style="margin-top: 10px;">
                            <input class="form-check-input" type="checkbox" value="">
                            <label class="form-check-label">
                                missing values/axes
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="form-group"
            style="margin-top: -10px; margin-left: 860px; text-align: left; width: 30rem; height: 23rem;">
            <textarea style="resize: none;" id="w3review" name="w3review" rows="4" cols="55" placeholder=" comment"
                v-model="comment"></textarea>
        </div>
    </div>
</template>
  
<script>
export default {
    name: "MainView",
    data() {
        return {
            images: [],
            currentIndex: 0,
            checkboxes: [],
            comment: ""
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

        const name = sessionStorage.getItem('name');
        if (name) {
            console.log('Name:', name);
        } else {
            console.log('Name not found in session storage');
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
            const checkboxes = document.querySelectorAll('.form-check-input');
            let isChecked = false;
            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    isChecked = true;
                }
            });
            if (isChecked) {
                if (!this.isLastImage) {
                    this.currentIndex++;
                    this.logCheckboxStates();
                    this.clearCheckboxes();
                    this.comment = '';
                } else {
                    this.$router.push('/testResult');
                }
            } else {
                alert("Please select at least one feature before proceeding.");
            }

            // if (!this.isLastImage) {
            //     this.currentIndex++;
            //     this.logCheckboxStates();
            //     this.clearCheckboxes();
            //     this.comment = '';
            // }
            // else {
            //     this.$router.push('/testResult');
            // }
        },
        clearCheckboxes() {
            const checkboxes = document.querySelectorAll('.form-check-input');
            checkboxes.forEach((checkbox) => {
                checkbox.checked = false;
            });
        },
        logCheckboxStates() {
            const checkboxes = document.querySelectorAll('.form-check-input');
            const selectedCheckboxes = [];
            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    selectedCheckboxes.push(checkbox.nextElementSibling.textContent.trim());
                }
            });
            const currentIndex = this.currentIndex;
            const storedCheckboxes = JSON.parse(sessionStorage.getItem('selectedCheckboxes')) || {};
            storedCheckboxes[`image${currentIndex + 0}`] = selectedCheckboxes;
            sessionStorage.setItem('selectedCheckboxes', JSON.stringify(storedCheckboxes));

            const storedComments = JSON.parse(sessionStorage.getItem('imageComments')) || {};
            storedComments[`image${currentIndex + 0}`] = this.comment;
            sessionStorage.setItem('imageComments', JSON.stringify(storedComments));

            console.log(`Image${currentIndex + 0}:`, selectedCheckboxes);
            console.log(`Comment for image${currentIndex + 0}: `, this.comment);
        },
    }
};
</script>

<style>
body,
html {
    overflow-y: hidden;
}
</style>
