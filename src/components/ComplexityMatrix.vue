<template>
    <div>
        <nav class="navbar navbar-default navbar-fixed-top"
            style="background-color: #C4E1D5; padding: 0.5rem 0; height: 40px;">
            <div class="container d-flex justify-content-center flex-column flex-md-row align-items-center">
                <h5 class="text-center text-md-left">Complexity matrix</h5>
            </div>
            <div style="margin-top:0.2rem; position:absolute; margin-left:75rem;">
                <button @click="changeViewTable" type="button" class="btn btn-outline-success btn-sm">Complexity
                    Table</button>
                <span style="margin-left: 0.3rem;"></span>
                <button @click="changeView" type="button" class="btn btn-outline-success btn-sm">Summary</button>
            </div>
        </nav>
        <div style="margin-top:1rem; height: 95vh; overflow-y: auto;">
            <table class="my-table" style="width:97%; margin-left:20px; margin-bottom:30px;">
                <tr>
                    <td></td>
                    <th v-for="number in 26" :key="number" @click="imageDisplay(number)" style="cursor: default;">
                        {{ number }}
                    </th>
                </tr>
                <tr v-for="rowIndex in 26" :key="rowIndex">
                    <th @click="imageDisplay(rowIndex)" style="cursor: default;">{{ rowIndex }}</th>
                    <td v-for="colIndex in 26" :key="colIndex">
                        <b>{{ rowIndex === colIndex ? '0' : '' }}</b>
                        <span v-if="rowIndex !== colIndex" :id="'counter-cell-' + rowIndex + '-' + colIndex"></span>
                        <span @click="firstExp" v-if="rowIndex === 1 && colIndex == 2">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                style="width: 14px; height: 14px; margin-top:-1.2rem; margin-right:-0.7rem; margin-left:0.2rem;"
                                fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path
                                    d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                            </svg>
                        </span>
                        <span @click="secondExp" v-if="rowIndex === 2 && colIndex == 1">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                style="width: 14px; height: 14px; margin-top:-1.2rem; margin-right:-0.7rem; margin-left:0.2rem;"
                                fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path
                                    d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                            </svg>
                        </span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
export default {
    name: "ComplexityMatrix",
    data() {
        return {
            items: [],
        };
    },
    created() {
        this.calculateScore();
    },
    methods: {
        changeView() {
            this.$router.push('/summaryView');
        },
        changeViewTable() {
            this.$router.push('/complexityTable');
        },
        firstExp() {
            alert("Out of 15 participants, 10 of them think that the first bar chart is more or equally complex as the second bar chart.")
        },
        secondExp() {
            alert("Out of 15 participants, 8 of them think that the second bar chart is more or equally complex as the first bar chart.")
        },
        imageDisplay(number) {
            this.$router.push({ path: '/imageDisplay', query: { number: number } });
        },
        calculateScore() {
            const imageScoresByUser = {};
            d3.csv('/pilotTest.csv').then(data => {
                data.forEach(row => {
                    const key = row.key;
                    const userName = row.userName;
                    const complexity = parseFloat(row.complexity);

                    if (!imageScoresByUser[key]) {
                        imageScoresByUser[key] = {};
                    }
                    // Store the user's score for this image
                    imageScoresByUser[key][userName] = complexity;
                });

                // Function to compare a given image with all other images
                function compareImageWithOthers(imageNumber) {
                    const baseImageKey = `image${imageNumber}`;
                    const users = Object.keys(imageScoresByUser[baseImageKey]); // Assuming the base image has all users

                    for (let i = 1; i <= 26; i++) {
                        if (i === imageNumber) continue; // Skip comparison with itself

                        let counter = 0;
                        const comparisonImageKey = `image${i}`;

                        users.forEach(userName => {
                            if (imageScoresByUser[baseImageKey][userName] >= imageScoresByUser[comparisonImageKey][userName]) {
                                counter++;
                            }
                        });

                        console.log(`Counter for ${baseImageKey} vs ${comparisonImageKey}: ${counter}`);
                        document.getElementById(`counter-cell-${imageNumber}-${i}`).innerText = counter;
                    }
                }
                for (let i = 1; i <= 26; i++) {
                    compareImageWithOthers(i);
                }

            }).catch(error => {
                console.error('Error loading dataset:', error);
            });
        }
    }
};
</script>
<style>
.my-table {
    border: 1px solid black;
    border-collapse: collapse;
}

.my-table th,
.my-table td {
    border: 1px solid black;
    padding: 8px;
    text-align: center;
}
</style>