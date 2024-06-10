<template>
    <nav class="navbar navbar-default navbar-fixed-top" style="background-color: #C4E1D5; padding: 0.5rem 0; height: 40px;">
        <div class="container d-flex justify-content-center flex-column flex-md-row align-items-center">
            <h5 class="text-center text-md-left">Overview of pilot test</h5>
        </div>
    </nav>
    <div
        style="border: 1px solid #DDD; width: 40rem; height: 30rem; margin-top: 6rem; margin-left: 35px; position: relative;">
        <h6 style="margin-top:-45px;">Average complexity score: <b>{{ averageValue }}</b></h6>
        <img :src="currentImage" alt="Your Image"
            style="max-width: 100%; max-height: 100%; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;">
    </div>

    <div v-if="showButton" style="margin-top: -34.8rem; position: absolute; width: 35%; margin-left: 63rem;">
        <button @click="handleButtonClick" type="button" class="btn btn-outline-secondary btn-sm"
            style="position:absolute;">Other</button>
    </div>

    <div style="margin-top: -11rem; position: absolute; width: 35%; margin-left: 62rem;">
        <p><small><small><small>Click on the bars for more details</small></small></small></p>
    </div>


    <div style="margin-left: 120px;">
        <svg @click="prevImage" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-caret-left-fill"
            viewBox="0 0 16 16"
            style="position: absolute; transform: translateX(-50%); margin-top: 2rem; margin-left: -29rem; width: 22px; height: 22px; ">
            <path
                d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
        </svg>

        <svg @click="handleSvgClick" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-caret-right-fill"
            viewBox="0 0 16 16"
            style="position: absolute; transform: translateX(-50%); margin-top: 2rem; margin-left: -27rem; width: 22px; height: 22px; ">
            <path
                d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
        </svg>
    </div>

    <div style="margin-left: 85px;">
        <p @click="prevImage" style="cursor: default; margin-top: -1px; margin-left:6.5rem; position: absolute;"><b>Previous
                image</b></p>
        <p @click="handleSvgClick" style="cursor: default; margin-top: 2rem; margin-right: 45rem;"><b>Next image</b></p>
    </div>

    <div>
        <p style="margin-top: -39em; margin-left: 60rem; position: absolute;">Graph Feature Recognition</p>
        <div id="bar-chart"
            style="border: 1px solid #DDD; width: 33rem; height: 20rem; margin-left: 50rem; margin-top: -37rem; position: absolute;">
        </div>
    </div>

    <div>
        <p style="margin-top: -15.5em; margin-left: 60rem; position: absolute;">Reasons for Complexity</p>
        <div id="category-chart"
            style="border: 1px solid #DDD; width: 33rem; height: 20rem; margin-left: 50rem; position: absolute; margin-top: -14rem; ">
        </div>
    </div>
</template>



<script>
import * as d3 from 'd3';
export default {
    name: "MainView",
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
        handleDetailClick() {
            alert("•Complexity:User finds the chart complex and hard to interpret. It can be hard to read, unclear and misleading. User needs some time to understand what is being shown. , \n•Context");
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
                            comments += `•${row.comment}\n`;
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
                    // keywords for analyzing comments
                    const keywordsAnalysis = {
                        'general complexity': ['presentation', 'complex', 'hard to interpret', 'complexity', 'unstructured', 'complicated', 'difficult', 'misleading', 'unclear', 'dont get', 'do not understand', 'hard to understand', 'hard to read', 'confused', 'confusing', 'unclear how to read', 'not clear', 'more time', 'abstract', 'nothing is clear', 'art', 'abstract'],
                        'context': ['context', 'title', 'titles', 'domain', 'tell', 'missing information', 'missing context', 'no context'],
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

                    // do not show categories with count = 0
                    for (const category in this.categoryCounts) {
                        if (this.categoryCounts[category] === 0) {
                            delete this.categoryCounts[category];
                        }
                    }

                    // Prepare data for the bar chart
                    const categoryData = Object.entries(this.categoryCounts).map(([category, count]) => {
                        return { category, count };
                    });
                    // sort by count
                    categoryData.sort((a, b) => b.count - a.count);

                    // Clear any existing chart
                    d3.select('#category-chart').selectAll('*').remove();
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
                        .range([height, 0])
                        .domain([0, d3.max(categoryData, d => d.count)]);

                    // Create bars
                    //svg.selectAll('.bar')
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
                        if (d.category === 'general complexity') {
                            alert("User has difficulties understanding and interpreting the chart. It can be unclear, misleading, hard to read and requires more time to decode the information.");
                        } else if (d.category === 'context') {
                            alert("The chart is missing some information or context which makes it difficult to understand what is being shown. The domain is unknown and there are no titles to explain this.");
                        }
                        else if (d.category === 'separation') {
                            alert("The chart would be easier to understand if there was some separation between the bars - also would help when comparing between them. There are a lot of bars being shown in the chart which are very close to each other.");
                        }
                        else if(d.category === 'axis and labels'){
                            alert("Chart has issues regarding x and y axis and its labels. Could be the case of no labels or axes, values not well readable or not clear to understand etc.");
                        }
                        else if(d.category === 'use of color'){
                            alert("User does not understand the reason behind the colors in the chart or is confused if this affects the type of the bar chart.")
                        }
                        else if (d.category==='missing legend'){
                            alert("There is no legend in the chart explaining what each color/group stands for. User does not really understand what the visualized data is representing.");
                        }
                        else if (d.category==='clutter'){
                            alert("User is overwhelmed by the amount of information in the chart. He cannot distinct values or other details in the chart, thinks that there is too much information being shown and that the chart is 'unreadable'.");
                        }
                        else if (d.category==='small values'){
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

                } else {
                    console.error(`No comments found for key "${imageName}" in the dataset.`);
                }
            }).catch(error => {
                console.error('Error reading dataset:', error);
            });
        },

        printAverageComplexity(imagePath) {
            const imageName = imagePath.split('/').pop().split('.')[0];
            const mappedImageName = this.mapImageName(imageName);
            const complexityData = this.averageComplexities.find(item => item.key === mappedImageName);
            if (complexityData) {
                //print average complexity score based on the image displayed
                //console.log(`Average complexity for ${mappedImageName}: ${complexityData.avgComplexity}`);
                //print to <p>
                this.averageValue = complexityData.avgComplexity;
                this.analyzeCommentComplexity(mappedImageName);
                this.commentComplexity = '';

                d3.csv('/pilotTest.csv').then(data => {
                    const imageRow = data.find(row => row.key === mappedImageName);
                    if (imageRow && imageRow.commentComplexity) {
                        this.commentComplexity = imageRow.commentComplexity;
                    }

                    const filteredRows = data.filter(row => row.key === mappedImageName);
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

                    //print count of each selected box
                    // Object.entries(selectedCheckboxesCounts).forEach(([checkbox, count]) => {
                    //     console.log(`${checkbox}=${count}`);
                    //     // print comment if not empty
                    //     if (checkbox === 'Other (please comment)' && count > 0) {
                    //         filteredRows.forEach(row => {
                    //             if (row.comment && row.comment.trim() !== '') {
                    //                 console.log(`Comment: ${row.comment}`);
                    //             }
                    //         });
                    //     }
                    // });

                    // Prepare data for bar chart
                    const dataForChart = Object.entries(selectedCheckboxesCounts).map(([checkbox, count]) => {
                        return { checkbox, count };
                    });
                    // rename bar 
                    dataForChart.forEach(d => {
                        if (d.checkbox === 'Other (please comment)') {
                            d.checkbox = 'Other';
                        }
                    });

                    // sorting data by count
                    dataForChart.sort((a, b) => b.count - a.count);

                    // Create the bar chart
                    const svgWidth = 500;
                    const svgHeight = 300;
                    const margin = { top: 20, right: 20, bottom: 90, left: 40 };
                    const width = svgWidth - margin.left - margin.right;
                    const height = svgHeight - margin.top - margin.bottom;

                    // Remove any existing SVG element
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
                        .domain(dataForChart.map(d => d.checkbox));

                    const y = d3.scaleLinear()
                        .range([height, 0])
                        .domain([0, d3.max(dataForChart, d => d.count)]);

                    svg.selectAll('.bar')
                        .data(dataForChart)
                        .enter()
                        .append('rect')
                        .attr('class', 'bar')
                        .attr('x', d => x(d.checkbox))
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


                    // Check if the 'Other' bar has a value greater than zero

                    const otherBarValue = selectedCheckboxesCounts['Other (please comment)'] || 0;
                    this.showButton = otherBarValue > 0;


                }).catch(error => {
                    console.error('Error loading dataset:', error);
                });
            }
        }
    }
};
</script>
<style>
.closebtn {
    margin-left: 15px;
    color: black;
    font-weight: bold;
    float: right;
    font-size: 22px;
    line-height: 20px;
    cursor: pointer;
}
</style>