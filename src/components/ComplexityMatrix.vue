<template>
    <div>
        <nav class="navbar navbar-default navbar-fixed-top"
            style="background-color: #C4E1D5; padding: 0.5rem 0; height: 40px;">

            <div style="float: left;" class="dropdown">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" style="margin-left:2rem; margin-bottom:1rem;"
                    fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                </svg>
                <div class="dropdown-content" style="top: 1.7rem; left:1.5rem;">
                    <a href="#" @click.prevent="testOverview" style="margin-bottom:2px;"> Test overview </a>
                    <a href="#" @click.prevent="changeViewTable" style="margin-bottom:2px;"> Complexity table </a>
                    <a href="#" @click.prevent="deviation" style="margin-bottom:2px;"> Rating deviation </a>
                    <a href="#" @click.prevent="error" style="margin-bottom:2px;"> Error evaluation </a>
                    <a href="#" @click.prevent="friendTest" style="margin-bottom:2px;"> Friend test </a>
                    <a href="#" @click.prevent="summary"> Summary </a>
                </div>
            </div>

            <div class="container d-flex justify-content-center flex-column flex-md-row align-items-center">
                <h5 class="text-center text-md-left">Complexity matrix of pilot test with 15 participants</h5>
                <svg @click="generalExp" xmlns="http://www.w3.org/2000/svg"
                    style="width: 14px; height: 14px; margin-top:-1.2rem; margin-right:-0.7rem; margin-left:0.2rem;"
                    fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path
                        d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg>
            </div>
        </nav>
        <div style="margin-top:1rem; height: 95vh; overflow-y: auto;">
            <table class="my-table" style="width:97%; margin-left:20px; margin-bottom:30px;">
                <tr>
                    <td></td>
                    <th v-for="number in 26" :key="number" style="cursor: pointer; position: relative; max-width: 10%;"
                        @click="imageDisplay(number)">
                        <img :src="require(`@/assets/${padNumber(number)}vis.png`)" :alt="`Visualization ${number}`"
                            style="max-width: 100%; max-height: 100%; display: block; margin: auto;">
                    </th>
                </tr>
                <tr v-for="rowIndex in 26" :key="rowIndex">
                    <th @click="imageDisplay(rowIndex)" style="cursor: default; width: 5%; background-color:#E8E8E8"><img
                            :src="require(`@/assets/${padNumber(rowIndex)}vis.png`)" :alt="`Visualization ${rowIndex}`"
                            style="max-width: 100%; max-height: 100%; display: block; margin: auto;"></th>

                    <td v-for="colIndex in 26" :key="colIndex" :id="'testCell-' + rowIndex + '-' + colIndex"
                        :style="getCellStyle(rowIndex, colIndex)">
                        <b style="color:grey;">{{ rowIndex === colIndex ? '0' : '' }}</b>
                        <b><span v-if="rowIndex !== colIndex" :id="'counter-cell-' + rowIndex + '-' + colIndex"></span></b>
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
        padNumber(number) {
            return number.toString().padStart(2, '0');
        },
        testOverview() {
            this.$router.push('/resultView');
        },
        changeViewTable() {
            this.$router.push('/complexityTable');
        },
        deviation() {
            this.$router.push('/ratingDeviation');
        },
        error() {
            this.$router.push('/errorEvaluation');
        },
        summary() {
            this.$router.push('/summaryView');
        },
        friendTest() {
            this.$router.push('/friendTest');
        },
        firstExp() {
            alert("Out of 15 participants, 7 of them think that the first bar chart (index 1 in row) is more complex than the second bar chart (index 2 in column).")
        },
        secondExp() {
            alert("Out of 15 participants, 5 of them think that the second bar chart (index 2 in row) is more complex than the first bar chart (index 1 in column).")
        },
        generalExp() {
            alert("This complexity matrix compares the complexity score given to the chart shown in the respective row with the one in the column. Since we do not consider the cases when the participants give equal complexity scores to the compared charts, the sum of values in symmetric positions does not always sum up to 15 (total nr of participants).");
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
                            if (imageScoresByUser[baseImageKey][userName] > imageScoresByUser[comparisonImageKey][userName]) {
                                counter++;
                            }
                        });

                        console.log(`Counter for ${baseImageKey} vs ${comparisonImageKey}: ${counter}`);
                        const cellId = `counter-cell-${imageNumber}-${i}`;
                        document.getElementById(cellId).innerText = counter;
                    }
                }
                for (let i = 1; i <= 26; i++) {
                    compareImageWithOthers(i);
                }
                // Update styles after the DOM is updated
                this.$nextTick(() => {
                    for (let rowIndex = 1; rowIndex <= 26; rowIndex++) {
                        for (let colIndex = 1; colIndex <= 26; colIndex++) {
                            const cell = document.getElementById(`testCell-${rowIndex}-${colIndex}`);
                            if (cell) {
                                cell.style.backgroundColor = this.getCellStyle(rowIndex, colIndex).backgroundColor;
                            }
                        }
                    }
                });

            }).catch(error => {
                console.error('Error loading dataset:', error);
            });
        },
        getCellStyle(rowIndex, colIndex) {
            const cellId = `counter-cell-${rowIndex}-${colIndex}`;
            const cellValue = parseInt(document.getElementById(cellId)?.innerText || '0', 10);
            let backgroundColor = 'white'; // Default color

            if (cellValue >= 1 && cellValue <= 4) {
                backgroundColor = '#B7E4C7';
            }
            else if (cellValue >= 5 && cellValue <= 8) {
                backgroundColor = '#95D5B2';
            }
            else if (cellValue >= 9 && cellValue <= 12) {
                backgroundColor = '#74C69D';
            }
            else if (cellValue >= 13 && cellValue <= 15) {
                backgroundColor = '#40916C';
            }
            else if (rowIndex == colIndex) {
                backgroundColor = '#F7F7F7';
            }
            else if (cellValue == 0) {
                backgroundColor = '#DFF5E3';
            }
            return { backgroundColor };
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

.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 170px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
}

.dropdown-content a {
    color: black;
    padding: 2px 2px;
    text-decoration: none;
    display: block;
}

.dropdown-content a:hover {
    background-color: #ddd;
}

.dropdown:hover .dropdown-content {
    display: block;
}

.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f1f1f1;
    min-width: 170px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
}

.dropdown-content a {
    color: black;
    padding: 2px 2px;
    text-decoration: none;
    display: block;
}

.dropdown-content a:hover {
    background-color: #ddd;
}

.dropdown:hover .dropdown-content {
    display: block;
}
</style>