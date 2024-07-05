<template>
    <nav class="navbar navbar-expand-md navbar-default navbar-fixed-top" style="background-color: #C4E1D5;">
        <div class="container">

            <div style="float: left;" class="dropdown">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" style="margin-left:-2rem;"
                    fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                </svg>
                <div class="dropdown-content" style="top: 1.7rem; left:-1.5rem;">
                    <a href="#" @click.prevent="changeViewMatrix" style="margin-bottom:2px;"> Complexity matrix </a>
                    <a href="#" @click.prevent="changeView" style="margin-bottom:2px;"> Complexity table </a>
                    <a href="#" @click.prevent="deviation" style="margin-bottom:2px;"> Rating deviation </a>
                    <a href="#" @click.prevent="error" style="margin-bottom:2px;"> Error evaluation </a>
                    <a href="#" @click.prevent="friendTest" style="margin-bottom:2px;"> Friend test</a>
                    <a href="#" @click.prevent="summary"> Summary </a>
                </div>
            </div>

            <h5 class="my-0 mr-md-auto" style="margin-left:29rem; position:absolute;">Overview of pilot test with 15
                participants</h5>
        </div>
    </nav>

    <div style="display: flex; justify-content: space-between; margin: 0 auto; max-width: 400px;">
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
        <div class="row" style="margin-top:3rem;">
            <div class="col"
                style="border: 1px solid #DDD; margin-right:2rem; width: 33rem; height: 20rem; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                <img :src="currentImage" alt="Your Image" style="max-width: 100%; max-height: 100%;">
            </div>

            <div class="col" style="border: 1px solid #DDD; width: 33rem; height: 20rem;">
                <p>Graph Feature Recognition</p>
                <div v-if="showButton" style="margin-top:-33px; margin-left:32rem;">
                    <button @click="handleButtonClick" type="button"
                        class="btn btn-outline-secondary btn-sm">Other*</button>
                </div>
                <div id="bar-chart" style="margin-top:-23px;"> </div>
            </div>
            <div class="w-100" style="margin-top:2rem;"></div>
            <div class="col" style="border: 1px solid #DDD; margin-right:2rem; width: 33rem; height: 20rem;">
                <p>Complexity scores - average value of <b>{{ averageValue }}</b></p>
                <div id="complexityScores-chart" style="margin-top:-11px; margin-right:20px;"> </div>
            </div>
            <div class="col" style="border: 1px solid #DDD; width: 33rem; height: 20rem;">
                <p>Reasons for Complexity</p>
                <div style="margin-left:28rem; margin-top:-42px;">
                    <p><small><small><small>Click on the bars for more details</small></small></small></p>
                </div>
                <div id="category-chart" style="margin-top:-11px;"></div>
            </div>
        </div>
    </div>
</template>


<script>
import * as d3 from 'd3';
export default {
    name: "ResultView",
    data() {
        return {
            images: [],
            currentIndex: 0,
            averageComplexities: [],
            averageValue: '',
            commentComplexity: '',
            dataset: [],
            categoryCounts: {},
            comments: [],
            alertVisible: false,
            showButton: false,
            keyObject: {}
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
        changeView() {
            this.$router.push('/ComplexityTable');
        },
        summary(){
            this.$router.push('/summaryView');
        },
        changeViewMatrix() {
            this.$router.push('/complexityMatrix');
        },
        deviation() {
            this.$router.push('/ratingDeviation');
        },
        error() {
            this.$router.push('/errorEvaluation');
        },
        friendTest() {
            this.$router.push('/friendTest');
        },
        handleButtonClick() {
            const imageName = this.mapImageName(this.currentImage.split('/').pop().split('.')[0]);
            d3.csv('/pilotTest.csv').then(data => {
                const filteredRows = data.filter(row => row.key === imageName);
                const selectedCheckboxesCounts = {};
                filteredRows.forEach(row => {
                    const selectedCheckboxes = JSON.parse(row.selectedCheckboxes);
                    selectedCheckboxes.forEach(checkbox => {
                        if (selectedCheckboxesCounts[checkbox]) {
                            selectedCheckboxesCounts[checkbox]++;
                        } else {
                            selectedCheckboxesCounts[checkbox] = 1;
                        }
                    });
                });
                let comments = '';

                // Print comment if 'Other (please comment)' box has count > 0
                const otherBoxCount = selectedCheckboxesCounts['Other (please comment)'] || 0;
                if (otherBoxCount > 0) {
                    filteredRows.forEach(row => {
                        if (row.comment && row.comment.trim() !== '') {
                            comments += `•${row.comment}\n\n`;
                        }
                    });
                }
                if (comments) {
                    alert(comments);
                } else {
                    alert('No comments found for this image.');
                }
            }).catch(error => {
                console.error('Error loading dataset:', error);
            });
        },
        handleSvgClick() {
            this.nextImage();
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
                const groupedData = d3.group(data, d => d.key);
                this.averageComplexities = Array.from(groupedData, ([key, values]) => {
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
        analyzeCommentComplexity(imageName) {
            d3.csv('/pilotTest.csv').then(data => {
                // get data where 'key' value is equal to current displayed
                const filteredData = data.filter(row => row.key === imageName);

                if (filteredData.length > 0) {
                    // creating bar chart for all complexity scores
                    const complexityData = filteredData.map(row => parseFloat(row.complexity));
                    // keywords for analyzing comments
                    const keywordsAnalysis = {
                        'context': ['abstract', 'unclear', 'dont get', 'do not understand', 'hard to understand', 'confused', 'nothing is clear', 'unclear how to read', 'not clear', 'presentation', 'context', 'title', 'titles', 'domain', 'tell', 'missing information', 'missing context', 'no context'],
                        'separation': ['separation', 'touching', 'comparing', 'comparison', 'spacing', 'a lot of bars', 'number of bars', 'many bars', 'compare', 'gaps', 'close', 'compare', 'thin lines', 'thin line'],
                        'axis and labels': ['label', 'labels', 'axis', 'axes', 'labeling'],
                        'use of color': ['color', 'colour', 'colors', 'colours', 'fade', 'fading', 'shade', 'shading'],
                        'missing legend': ['legend', 'legends', 'represents', 'represent', 'representing', 'stand for', 'stands for', 'categories'],
                        'clutter': ['crowded', 'cant read', 'hard to see', 'hard to read', 'occupied', 'dense', 'a lot of information', 'takes time', 'too much information', 'overloaded', 'too much going on', 'unreadable'],
                        'small values': ['small values', 'values too small', 'values small', 'small', 'very small', 'cannot be read', 'hard to see', 'readable'],
                    };

                    // initialize count of 0 for each category
                    this.categoryCounts = Object.fromEntries(Object.keys(keywordsAnalysis).map(category => [category, 0]));

                    // extract only commentComplexity for the displayed image
                    const comments = filteredData.map(row => row.commentComplexity);

                    // find count for each category
                    comments.forEach(comment => {
                        for (const [category, keywords] of Object.entries(keywordsAnalysis)) {
                            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'ig');
                            const matches = comment.match(regex);
                            if (matches) {
                                this.categoryCounts[category] += matches.length;
                            }
                        }
                    });

                    // Prepare data for the bar chart
                    const categoryData = Object.entries(this.categoryCounts).map(([category, count]) => {
                        return { category, count };
                    });
                    // Clear any existing chart
                    d3.select('#category-chart').selectAll('*').remove();
                    d3.select('#complexityScores-chart').selectAll('*').remove();
                    // Set up SVG dimensions
                    const svgWidth = 500;
                    const svgHeight = 300;
                    const margin = { top: 20, right: 20, bottom: 90, left: 40 };
                    const width = svgWidth - margin.left - margin.right;
                    const height = svgHeight - margin.top - margin.bottom;
                    // Create SVG element
                    const svg = d3.select('#category-chart')
                        .append('svg')
                        .attr('width', svgWidth)
                        .attr('height', svgHeight)
                        .append('g')
                        .attr('transform', `translate(${margin.left},${margin.top})`);

                    // Define scales
                    const x = d3.scaleBand()
                        .range([0, width])
                        .padding(0.1)
                        .domain(categoryData.map(d => d.category));

                    const y = d3.scaleLinear()
                        .domain([0, 15])
                        .range([height, 0]);

                    // Create bars
                    const bars = svg.selectAll('.bar')
                        .data(categoryData)
                        .enter()
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('x', d => x(d.category))
                        .attr('width', x.bandwidth())
                        .attr('y', d => y(d.count))
                        .attr('height', d => height - y(d.count))
                        .attr('fill', '#AED2D6');

                    bars.on('click', function (event, d) {
                        if (d.category === 'ambiguity') {
                            alert("User has difficulties interpreting the chart. It can be unclear, misleading, hard to read and understand what the chart is showing.");
                        } else if (d.category === 'context') {
                            alert("The chart is missing some information or context which makes it difficult to understand what is being shown. The domain is unknown and there are no titles to explain this.");
                        }
                        else if (d.category === 'separation') {
                            alert("The chart would be easier to understand if there was some separation between the bars - also would help when comparing between them. There are a lot of bars being shown in the chart which are very close to each other. Comparing between bars or different categories is not easy / requires some time.");
                        }
                        else if (d.category === 'axis and labels') {
                            alert("Chart has issues regarding x and y axis and its labels. Could be the case of no labels or axes, values not well readable or not clear to understand etc.");
                        }
                        else if (d.category === 'use of color') {
                            alert("User does not understand the reason behind the colors in the chart or is confused if this affects the type of the bar chart.")
                        }
                        else if (d.category === 'missing legend') {
                            alert("There is no legend in the chart explaining what each color/group stands for. User does not really understand what the visualized data is representing.");
                        }
                        else if (d.category === 'clutter') {
                            alert("User is overwhelmed by the amount of information in the chart. He cannot distinct values or other details in the chart, thinks that there is too much information being shown and that the chart is 'unreadable'.");
                        }
                        else if (d.category === 'small values') {
                            alert("The visualized data contains very small values which are difficult to read or see. The value of a bar can be almost unreadable.");
                        }
                    });

                    // Append x-axis
                    svg.append('g')
                        .attr('class', 'x-axis')
                        .attr('transform', `translate(0,${height})`)
                        .call(d3.axisBottom(x))
                        .selectAll('text')
                        .attr('transform', 'rotate(-45)')
                        .style('text-anchor', 'end');

                    // Append y-axis
                    svg.append('g')
                        .attr('class', 'y-axis')
                        .call(d3.axisLeft(y).ticks(5));

                    svg.append("text")
                        .attr("class", "y label")
                        .attr("text-anchor", "end")
                        .attr("y", 2)
                        .attr("dy", "-2em")
                        .attr("dx", "0.5em")
                        .attr("transform", "rotate(-90)")
                        .style("font-size", "13px")
                        .text("nr.of votes");

                    // all complexity scores bar chart
                    const complexityCounts = [1, 2, 3, 4, 5].map(value => {
                        return {
                            score: value,
                            count: complexityData.filter(d => d === value).length
                        };
                    });

                    // Clear any existing chart
                    d3.select('#complexityScores-chart').selectAll('*').remove();

                    // Set up SVG dimensions
                    const svgWidth1 = 500;
                    const svgHeight1 = 300;
                    const margin1 = { top: 20, right: 20, bottom: 90, left: 40 };
                    const width1 = svgWidth1 - margin1.left - margin1.right;
                    const height1 = svgHeight1 - margin1.top - margin1.bottom;

                    // Create SVG element
                    const svg1 = d3.select('#complexityScores-chart')
                        .append('svg')
                        .attr('width', svgWidth1)
                        .attr('height', svgHeight1)
                        .append('g')
                        .attr('transform', `translate(${margin1.left},${margin1.top})`);

                    // Define scales
                    const x1 = d3.scaleBand()
                        .domain(complexityCounts.map(d => d.score))
                        .range([0, width1])
                        .padding(0.1);

                    const y1 = d3.scaleLinear()
                        .domain([0, 15.5])
                        .range([height1, 0]);

                    // Create bars
                    svg1.selectAll('.bar')
                        .data(complexityCounts)
                        .enter().append('rect')
                        .attr('class', 'bar')
                        .attr('x', d => x1(d.score))
                        .attr('width', x1.bandwidth())
                        .attr('y', d => y1(d.count))
                        .attr('height', d => height1 - y1(d.count))
                        .attr('fill', '#AED2D6');

                    // Append x-axis
                    svg1.append('g')
                        .attr('class', 'x-axis')
                        .attr('transform', `translate(0,${height1})`)
                        .call(d3.axisBottom(x1));

                    // Append y-axis
                    svg1.append('g')
                        .attr('class', 'y-axis')
                        .call(d3.axisLeft(y1));

                    // Append y-axis label
                    svg1.append("text")
                        .attr("class", "y label")
                        .attr("text-anchor", "end")
                        .attr("y", 2)
                        .attr("dy", "-1.9em")
                        .attr("dx", "0.6em")
                        .attr("transform", "rotate(-90)")
                        .style("font-size", "13px")
                        .text("frequency");

                    svg1.append("text")
                        .attr("class", "x label")
                        .attr("text-anchor", "end")
                        .attr("x", width + 15)
                        .attr("y", height + 20)
                        .style("font-size", "13px")
                        .text("score");

                } else {
                    console.error(`No comments found for key "${imageName}" in the dataset.`);
                }
            }).catch(error => {
                console.error('Error reading dataset:', error);
            });
        },
        printAverageComplexity(imagePath) {
            const customOrder = [
                'Simple - 1D', 'Grouped', 'Stacked', 'Nested 1', 'Dot Bar Chart',
                'Radial', 'No gaps 2', '3D', 'Embellished', 'Error bars',
                'Missing labels', 'Missing legend', 'Background element', 'Missing values / axes',
                'Monochrome', 'Small values', 'Gantt chart', 'Box plot', 'Other (please comment)'
            ];

            const labels = {
                'Missing values / axes': 'Values/Axes',
                'Missing labels': 'Labels',
                'Missing legend': 'Legend',
                'Other (please comment)': 'Other',
                'Background element': 'Background',
                'Simple - 1D': 'Simple',
                'No gaps 2': 'No gaps',
                'Nested 1': 'Nested',
            };

            const imageName = imagePath.split('/').pop().split('.')[0];
            const mappedImageName = this.mapImageName(imageName);
            const complexityData = this.averageComplexities.find(item => item.key === mappedImageName);

            if (complexityData) {
                this.averageValue = complexityData.avgComplexity;
                this.analyzeCommentComplexity(mappedImageName);
                this.commentComplexity = '';

                d3.csv('/pilotTest.csv').then(data => {
                    const filteredData = data.filter(row => row.key === mappedImageName);

                    const selectedCheckboxesCounts = {
                        'Simple - 1D': 0, 'Grouped': 0, 'Stacked': 0, 'Nested 1': 0, 'Dot Bar Chart': 0,
                        'Radial': 0, 'No gaps 2': 0, '3D': 0, 'Embellished': 0, 'Error bars': 0,
                        'Missing labels': 0, 'Missing legend': 0, 'Background element': 0, 'Missing values / axes': 0,
                        'Monochrome': 0, 'Small values': 0, 'Gantt chart': 0, 'Box plot': 0, 'Other (please comment)': 0,
                    };

                    // Update counts based on selected checkboxes in filtered data
                    filteredData.forEach(row => {
                        const parsedCheckboxes = JSON.parse(row.selectedCheckboxes);
                        parsedCheckboxes.forEach(checkbox => {
                            if (Object.hasOwnProperty.call(selectedCheckboxesCounts, checkbox)) {
                                selectedCheckboxesCounts[checkbox]++;
                            }
                        });
                    });

                    const dataForChart = Object.keys(selectedCheckboxesCounts).map(checkbox => {
                        return { checkbox, count: selectedCheckboxesCounts[checkbox] };
                    });

                    // Sort dataForChart based on customOrder
                    dataForChart.sort((a, b) => {
                        return customOrder.indexOf(a.checkbox) - customOrder.indexOf(b.checkbox);
                    });

                    const svgWidth = 500;
                    const svgHeight = 300;
                    const margin = { top: 20, right: 20, bottom: 90, left: 40 };
                    const width = svgWidth - margin.left - margin.right;
                    const height = svgHeight - margin.top - margin.bottom;

                    d3.select('#bar-chart').selectAll('*').remove();

                    const svg = d3.select('#bar-chart')
                        .append('svg')
                        .attr('width', svgWidth)
                        .attr('height', svgHeight)
                        .append('g')
                        .attr('transform', `translate(${margin.left},${margin.top})`);

                    const x = d3.scaleBand()
                        .range([0, width])
                        .padding(0.1)
                        .domain(dataForChart.map(d => labels[d.checkbox] || d.checkbox));

                    const y = d3.scaleLinear()
                        .domain([0, 15.5]) // Adjust domain based on your data
                        .range([height, 0]);

                    svg.selectAll('.bar')
                        .data(dataForChart)
                        .enter()
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('x', d => x(labels[d.checkbox] || d.checkbox))
                        .attr('width', x.bandwidth())
                        .attr('y', d => y(d.count))
                        .attr('height', d => height - y(d.count))
                        .attr('fill', '#AED2D6');

                    svg.append('g')
                        .attr('class', 'x-axis')
                        .attr('transform', `translate(0,${height})`)
                        .call(d3.axisBottom(x))
                        .selectAll('text')
                        .attr('transform', 'rotate(-45)')
                        .style('text-anchor', 'end');

                    svg.append('g')
                        .attr('class', 'y-axis')
                        .call(d3.axisLeft(y).ticks(5));

                    svg.append("text")
                        .attr("class", "y label")
                        .attr("text-anchor", "end")
                        .attr("y", 2)
                        .attr("dy", "-2em")
                        .attr("dx", "0.5em")
                        .attr("transform", "rotate(-90)")
                        .style("font-size", "13px")
                        .text("nr.of votes");

                    const otherBarValue = selectedCheckboxesCounts['Other (please comment)'] || 0;
                    this.showButton = otherBarValue > 0;

                }).catch(error => {
                    console.error('Error loading dataset:', error);
                });
            }
        },
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
