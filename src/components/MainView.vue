<template>
    <div>
        <nav class="navbar navbar-default navbar-fixed-top" style="background-color: #C4E1D5; height: 3rem; width: 90rem;">
            <div class="container d-flex justify-content-center">
                <h5 class="mt-1">{{ showButton ? 'Please select the complexity level and state your reasoning.' : 'Please select all features that apply to the displayed chart.' }}</h5>
                <p v-if="name" style="margin-top: 20px;">Name: {{ name }}</p>
            </div>
        </nav>
        <div style="display: flex;">
            <div
                style="border: 1px solid #DDD; width: 47rem; height: 30rem; margin-top: 60px; margin-left: 20px; position: relative;">
                <img :src="currentImage" alt="Your Image"
                    style="max-width: 100%; max-height: 100%; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;">
            </div>
            <div style="position: absolute; margin-top: 540px; margin-left: 20px;">
                <p class="text-secondary"><small>{{ loopResult }}/27</small></p>
            </div>


            <div v-if="showButton" style="margin-top: 150px; margin-left: 100px; text-align: left;">

                <h5 class="mb-4">How complex do you find this chart?</h5>
                <input type="range" class="form-range" min="1" max="5" step="1" id="customRange3" value="3"
                    v-model="complexity">
                <div id="labels" style="display: flex; justify-content: space-between; margin-top:-10px;">
                    <span><small>1</small></span>
                    <span><small>2</small></span>
                    <span><small>3</small></span>
                    <span><small>4</small></span>
                    <span><small>5</small></span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top:-10px;">
                    <span style="margin-left: -25px;"><small><small>not complex</small></small></span>
                    <span style="margin-right: -30px;"><small><small>very complex</small></small></span>
                </div>

                <div style="margin-top:60px;">
                    <p>Please explain your choice</p>
                    <div>
                        <textarea style="resize: none;" id="complexityText" rows="3" cols="55" placeholder=" comment"
                            v-model="commentComplexity"></textarea>
                    </div>
                </div>

                <button @click="toggleVisibility" type="button" class="btn btn-outline-success"
                    style="margin-left:400px; margin-top:20px;">Next</button>
            </div>




            <div v-else class="form-check" style="position: relative;">
                <div style="margin-top:40px; margin-left: 80px; text-align: left;">
                    <h5>Bar Chart type</h5>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Simple - 1D
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Grouped
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Stacked
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Nested <sup>1</sup>
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Dot bar chart
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Radial
                        </label>
                    </div>
                </div>


                <div style="position: absolute; top: 40px; left: 380px; text-align: left;">
                    <h5 style="white-space: nowrap;">Bar Chart details</h5>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            No gaps <sup>2</sup>
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            3D
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Embellished
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Error bars
                        </label>
                    </div>
                </div>


                <div style="margin-top:34px; margin-left: 70px; text-align: left;">
                    <h5>Overall issues</h5>
                    <div>
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Missing labels
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Missing legend
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Background element
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Monochrome
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Missing values / axes
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Small values
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label">
                            Other <small><i>(please comment)</i></small>
                        </label>
                    </div>
                </div>


                <div style="position: absolute; top:299px; left: 380px; text-align: left;">
                    <h5 style="white-space: nowrap;">Other charts</h5>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label" style="white-space: nowrap;">
                            Gantt chart
                        </label>
                    </div>
                    <div style="margin-top: 10px;">
                        <input class="form-check-input" type="checkbox" value="">
                        <label class="form-check-label" style="white-space: nowrap;">
                            Box plot
                        </label>
                    </div>
                </div>

                <div class="form-group" style="position: absolute; left: 100px; top: 580px;">
                    <textarea style="resize: none;" id="w3review" rows="3" cols="55" placeholder=" comment"
                        v-model="comment"></textarea>
                    <p style="margin-top: 10px;"><small><small><sup>1</sup> Nested bar charts are those type of charts where
                                bars overlap one another.</small></small></p>
                    <p style="margin-top: -20px;"><small><small><sup>2</sup> No-gap bar charts are those type of charts
                                where there is little or no distance</small></small></p>
                    <p style="margin-top: -20px; text-align: left;"><small><small> &nbsp; &nbsp; &nbsp; between
                                bars.</small></small> </p>
                </div>

                <div class="form-group" style="position: absolute; margin-left: -450px; top: 600px;">
                    <svg @click="handleSvgClick" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16"
                        style="position: absolute; top: 110%; left: 50%; transform: translateX(-50%); margin-top: -10px; width: 2rem; height: 2rem;">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>
                </div>
                <div class="form-group" style="position: absolute; margin-left: -430px; top: 595px;">
                    <p @click="handleSvgClick" style="cursor: default;"><b>{{ isLastImage
                        ? 'Submit result'
                        : 'Next image'
                    }}</b></p> 
                </div>

                
            </div>
        </div>

        <div class="form-group"
            style="margin-top: 30px; margin-left: 860px; text-align: left; width: 30rem; height: 23rem;">
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
            loopResult: '',
            checkboxes: [],
            comment: "",
            showButton: true,
            complexity: 3,
            commentComplexity: "",
            name: "",
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
        this.imageCounter();
        const name = sessionStorage.getItem('name');
        if (name) {
            console.log('Name:', name);
        } else {
            console.log('Name not found in session storage');
        }
    },
    methods: {
        imageCounter(){
            this.loopResult = this.currentIndex+1;
        },
        loadImages() {
            const context = require.context('@/assets/', false, /\.(png)$/);
            const imagePaths = context.keys().sort();
            this.images = imagePaths.map(key => context(key));
            this.imageCounter();
        },
        prevImage() {
            if (!this.isFirstImage) {
                this.currentIndex--;
                this.imageCounter();
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
                this.logCheckboxStates();
                this.clearCheckboxes();
                this.comment = '';
                this.commentComplexity = '';
                this.complexity = 3;

                if (!this.isLastImage) {
                    this.currentIndex++;
                    this.showButton = true;
                    this.imageCounter();
                } else {
                    this.$router.push('/testResult');
                }
            } else {
                alert("Please select at least one feature before proceeding.");
            }
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
            storedCheckboxes[`image${currentIndex + 1}`] = selectedCheckboxes;
            sessionStorage.setItem('selectedCheckboxes', JSON.stringify(storedCheckboxes));

            const storedComments = JSON.parse(sessionStorage.getItem('imageComments')) || {};
            storedComments[`image${currentIndex + 1}`] = this.comment;
            sessionStorage.setItem('imageComments', JSON.stringify(storedComments));

            const storedComplexities = JSON.parse(sessionStorage.getItem('imageComplexities')) || {};
            storedComplexities[`image${currentIndex + 1}`] = this.complexity;
            sessionStorage.setItem('imageComplexities', JSON.stringify(storedComplexities));

            const storedCommentComplexities = JSON.parse(sessionStorage.getItem('imageCommentComplexities')) || {};
            storedCommentComplexities[`image${currentIndex + 1}`] = this.commentComplexity;
            sessionStorage.setItem('imageCommentComplexities', JSON.stringify(storedCommentComplexities));

            console.log(`Image${currentIndex + 0}:`, selectedCheckboxes);
            console.log(`Comment for image${currentIndex + 0}: `, this.comment);
        },
        toggleVisibility() {
            const currentIndex = this.currentIndex;
            console.log(`Complexity value${currentIndex + 1}: ${this.complexity}`);
            console.log(`Comment complexity${currentIndex + 1}: ${this.commentComplexity}`);

            if (!this.commentComplexity.trim()) {
                alert('Please explain your choice.');
            }
            else {
                this.showButton = false;
            }
        },
        handleSvgClick() {
            if (this.showButton) {
                this.toggleVisibility();
            } else {
                this.nextImage();
            }
        }
    }
};
</script>

<style>
body,
html {
    overflow-y: hidden;
}
</style>
