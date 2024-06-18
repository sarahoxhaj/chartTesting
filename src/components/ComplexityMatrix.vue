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
        <div style="margin-top:1rem;">
            <table class="my-table" style="width:97%; margin-left:20px; margin-bottom:30px;">
                <tr>
                    <td></td>
                    <th v-for="number in 26" :key="number">{{ number }}</th>
                </tr>
                <tr v-for="rowIndex in 26" :key="rowIndex">
                    <th>{{ rowIndex }}</th>
                    <td v-for="colIndex in 26" :key="colIndex">
                        <b>{{ rowIndex === colIndex ? '0' : '' }}</b>
                        <span v-if="rowIndex !== colIndex" :id="'counter-cell-' + rowIndex + '-' + colIndex"></span>
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
                for(let i=1;i<=26;i++){
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