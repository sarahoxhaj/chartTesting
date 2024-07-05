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
                    <a href="#" @click.prevent="changeViewMatrix" style="margin-bottom:2px;"> Complexity matrix </a>
                    <a href="#" @click.prevent="changeViewTable" style="margin-bottom:2px;"> Complexity table </a>
                    <a href="#" @click.prevent="error" style="margin-bottom:2px;"> Error evaluation </a>
                    <a href="#" @click.prevent="friendTest"> Friend test </a>
                    <a href="#" @click.prevent="summary"> Summary </a>
                </div>
            </div>

            <h5 class="my-0 mr-md-auto" style="margin-left:40rem; position:absolute;">Rating deviations</h5>
        </nav>
        <div style="display: flex; justify-content: space-between; margin: 0 auto; max-width: 400px; margin-top:3rem;">
            <div style="display: flex; align-items: center;">
                <svg @click="prevImage" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-caret-left-fill"
                    viewBox="0 0 16 16"
                    style="width: 22px; height: 22px; margin-left:11.5rem; margin-top: 2rem; position: absolute;">
                    <path
                        d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                </svg>
                <p style="font-size: 14px; margin-left:6em; margin-top: 3rem; position: absolute;">Previous image</p>
            </div>
            <div style="display: flex; align-items: center;">
                <svg @click="handleSvgClick" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                    class="bi bi-caret-right-fill" viewBox="0 0 16 16"
                    style="width: 22px; height: 22px; margin-top: 2rem; position: absolute; margin-left:-12rem;">
                    <path
                        d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                </svg>
                <p style="font-size: 14px; margin-top: 3rem; position: absolute; margin-left:-12em;">Next image</p>
            </div>
        </div>
        <div class="container" style="position:relative;">
            <div class="row" style="margin-top:5rem;">
                <div class="col"
                    style="margin-left:2rem; border: 1px solid #DDD; margin-right:2rem; width: 40rem; height: 27rem; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                    <img :src="currentImage" alt="Your Image" style="max-width: 100%; max-height: 100%;">
                </div>
                <div class="col" style="border: 1px solid #DDD; margin-right:2rem; width: 40rem; height: 27rem;">
                    <p>Complexity scores - average value of <b>{{ averageValue }}</b></p>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        style="width: 12px; height: 12px; margin-left:20rem; margin-top:-5rem;" fill="currentColor"
                        class="bi bi-info-circle" viewBox="0 0 16 16" @click="firstExp">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path
                            d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>
                    <svg id="bar-chart" style="width: 100%; height: 100%;"></svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
export default {
    name: "RatingDeviation",
    data() {
        return {
            images: [],
            currentIndex: 0,
            averageComplexities: [],
            averageValue: '',
            dataset: [],
            groupedData: new Map(),
            userScores: {},
            differences: []
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
    watch: {
        currentImage(newImage) {
            this.printAverageComplexity(newImage);
        }
    },
    created() {
        this.loadImages();
        this.imageCounter();
        this.loadDataset();
    },
    methods: {
        changeViewTable() {
            this.$router.push('/ComplexityTable');
        },
        summary() {
            this.$router.push('/summaryView');
        },
        changeViewMatrix() {
            this.$router.push('/complexityMatrix');
        },
        testOverview() {
            this.$router.push('/resultView');
        },
        error() {
            this.$router.push('/errorEvaluation');
        },
        friendTest(){
            this.$router.push('/friendTest');
        },
        handleSvgClick() {
            this.nextImage();
        },
        firstExp() {
            alert("The delta values show how participants perception for the complexity of the bar chart differs from the average perception.\n                               Δ=userScore-averageScore\n\n•A positive value means that they ranked the chart higher than the average value.\n•A negative value means that the participants ranked the chart lower than the average value.\n•A delta equal to 0 represents that all participants ranked the chart the same, confirming the average score.")
        },
        nextImage() {
            if (this.isLastImage) {
                this.currentIndex = 0; // if last image, start from the first one
            } else {
                this.currentIndex++;
            }
            this.showButton = true;
            this.imageCounter();
        },
        imageCounter() {
            this.loopResult = this.currentIndex + 1;
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
        loadDataset() {
            d3.csv('/pilotTest.csv').then(data => {
                data.forEach(d => {
                    d.complexity = +d.complexity;
                });
                this.groupedData = d3.group(data, d => d.key);
                this.averageComplexities = Array.from(this.groupedData, ([key, values]) => {
                    const avgComplexity = d3.mean(values, d => d.complexity);
                    return { key, avgComplexity: Math.round(avgComplexity * 10) / 10 };
                });
                this.printAverageComplexity(this.currentImage);
            }).catch(error => {
                console.error('Error loading dataset:', error);
            });
        },
        // mapping the image name - name in assets folder and key value from data set
        mapImageName(assetImageName) {
            const imageNumber = assetImageName.match(/\d+/)[0];
            return `image${parseInt(imageNumber)}`;
        },
        printAverageComplexity(imagePath) {
            const imageName = imagePath.split('/').pop().split('.')[0];
            const mappedImageName = this.mapImageName(imageName);
            const complexityData = this.averageComplexities.find(item => item.key === mappedImageName);

            if (complexityData) {
                this.averageValue = complexityData.avgComplexity;
                const values = this.groupedData.get(mappedImageName).map(d => ({ userName: d.userName, complexity: d.complexity }));
                this.saveUserScores(mappedImageName);

                this.differences = []; // Reset differences array
                values.forEach(userScore => {
                    const difference = userScore.complexity - this.averageValue;
                    const diff = Math.round(difference * 10) / 10;
                    //console.log(`User: ${userScore.userName}, Value: {${diff}}`);
                    this.differences.push(diff);
                });

                this.renderBarChart(this.calculateFrequencies(this.differences));
            } else {
                this.averageValue = 'N/A';
            }
        },
        saveUserScores(imageName) {
            const userScores = this.groupedData.get(imageName).map(d => ({ userName: d.userName, complexity: d.complexity }));
            this.userScores[imageName] = userScores;
            //console.log(`User scores for ${imageName}:`, userScores);
        },
        calculateFrequencies(data) {
            const frequencyMap = new Map();

            const groups = [
                { label: '-2.5 to -3', min: -3, max: -2.5 },
                { label: '-1.5 to -2.4', min: -2.4, max: -1.5 },
                { label: '-0.1 to -1.4', min: -1.4, max: -0.1 },
                { label: '0', min: 0, max: 0 },
                { label: '0.1 to 1.4', min: 0.1, max: 1.4 },
                { label: '1.5 to 2.4', min: 1.5, max: 2.4 },
                { label: '2.5 to 3', min: 2.5, max: 3 },
            ];

            groups.forEach(group => frequencyMap.set(group.label, 0));

            data.forEach(value => {
                for (let i = 0; i < groups.length; i++) {
                    if (value >= groups[i].min && value <= groups[i].max) {
                        let count = frequencyMap.get(groups[i].label);
                        frequencyMap.set(groups[i].label, count + 1);
                        break; // Exit loop once assigned
                    }
                }
            });

            return groups.map(group => ({ value: group.label, count: frequencyMap.get(group.label) }));
        },
        renderBarChart(frequencyData) {

            d3.select("#bar-chart").select("g").remove();

            const container = d3.select("#bar-chart").node().getBoundingClientRect();
            const margin = { top: 20, right: 30, bottom: 80, left: 70 };
            const width = container.width - margin.left - margin.right - 50;
            const height = container.height - margin.top - margin.bottom - 50;

            frequencyData.sort((a, b) => a.value - b.value);

            const svg = d3.select("#bar-chart")
                .attr("width", container.width)
                .attr("height", container.height)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleBand()
                .domain(frequencyData.map(d => d.value))
                .range([0, width])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, 15])
                .range([height, 0]);

            svg.append("g")
                .selectAll("rect")
                .data(frequencyData)
                .enter()
                .append("rect")
                .attr("x", d => x(d.value))
                .attr("y", d => y(d.count))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(d.count))
                .attr('fill', '#AED2D6');


            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x));

            svg.append("g")
                .call(d3.axisLeft(y)
                    .ticks(5)
                    .tickFormat(d3.format("d"))
                );

            svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("y", 2)
                .attr("dy", "-2.5em")
                .attr("dx", "0.6em")
                .attr("transform", "rotate(-90)")
                .style("font-size", "12px")
                .text("frequency");

            // svg.append("text")
            //     .attr("class", "x label")
            //     .attr("text-anchor", "end")
            //     .attr("x", width + 15)
            //     .attr("y", height + 15)
            //     .style("font-size", "12px")
            //     .text("delta");
        }

    }
};
</script>
<style>
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
