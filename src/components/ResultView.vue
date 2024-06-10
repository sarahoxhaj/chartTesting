<template>
    <nav class="navbar navbar-default navbar-fixed-top" style="background-color: #C4E1D5; padding: 0.5rem 0; height: 40px;">
        <div class="container d-flex justify-content-center flex-column flex-md-row align-items-center">
            <h5 class="text-center text-md-left">Overview of pilot test</h5>
        </div>
    </nav>
    <div
        style="border: 1px solid #DDD; width: 40rem; height: 30rem; margin-top: 6rem; margin-left: 20px; position: relative;">
        <h6 style="margin-top:-45px;">Average complexity score: {{ averageValue }}</h6>
        <img :src="currentImage" alt="Your Image"
            style="max-width: 100%; max-height: 100%; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;">
    </div>
    <div>
        <svg @click="handleSvgClick" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-caret-right-fill"
            viewBox="0 0 16 16"
            style="position: absolute; transform: translateX(-50%); margin-top: 2rem; margin-left: -27rem; width: 22px; height: 22px; ">
            <path
                d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
        </svg>
    </div>
    <div>
        <p @click="handleSvgClick" style="cursor: default; margin-top: 2rem; margin-right: 45rem;"><b>Next image</b></p>
    </div>

    <div>
        <div id="bar-chart"
            style="border: 1px solid #DDD; width: 33rem; height: 20rem; margin-left: 50rem; margin-top: -37rem; position: absolute;">
        </div>
    </div>

    <div
        style="border: 1px solid #DDD; width: 33rem; height: 20rem; margin-left: 50rem; position: absolute; margin-top: -15rem;">
        <p v-for="(count, category) in categoryCounts" :key="category">{{ category }}: {{ count }}</p>
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
        handleSvgClick() {
            this.nextImage();
        },
        nextImage() {
            this.currentIndex++;
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
            d3.csv('/testResult.csv').then(data => {
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
        mapImageName(assetImageName) {
            const imageNumber = assetImageName.match(/\d+/)[0];
            return `image${parseInt(imageNumber)}`;
        },


        analyzeCommentComplexity(imageName) {
            d3.csv('/testResult.csv').then(data => {
                // Filter the dataset to get rows where 'key' is equal to the current image name
                const filteredData = data.filter(row => row.key === imageName);

                if (filteredData.length > 0) {
                    // Define the bag of words for complexity analysis
                    const bag_of_words = {
                        'complexity': ['presentation', 'complex', 'hard to interpret', 'complexity', 'unstructured', 'complicated', 'difficult', 'misleading', 'unclear', 'dont get', 'do not understand', 'hard to understand', 'hard to read', 'confused', 'confusing', 'unclear how to read', 'not clear', 'more time', 'abstract', 'nothing is clear', 'art', 'abstract'],
                        'context': ['context', 'title', 'titles', 'domain', 'tell', 'missing information', 'missing context', 'no context'],
                        'separation': ['separation', 'touching', 'comparing', 'comparison', 'spacing', 'a lot of bars', 'number of bars', 'many bars', 'compare', 'gaps', 'close', 'compare', 'thin lines', 'thin line'],
                        'axis and labels': ['label', 'labels', 'axis', 'axes', 'labeling'],
                        'use of color': ['color', 'colour', 'colors', 'colours', 'fade', 'fading', 'shade', 'shading'],
                        'missing legend': ['legend', 'legends', 'represents', 'represent', 'representing', 'stand for', 'stands for', 'categories'],
                        'clutter': ['crowded', 'cant read', 'hard to see', 'hard to read', 'occupied', 'dense', 'a lot of information', 'takes time', 'too much information', 'overloaded', 'too much going on', 'unreadable'],
                        'small values': ['small values', 'values too small', 'values small', 'small', 'very small', 'cannot be read', 'hard to see', 'readable'],
                    };

                    // Initialize category counts
                    this.categoryCounts = Object.fromEntries(Object.keys(bag_of_words).map(category => [category, 0]));

                    // Extract comments from the filtered data
                    const comments = filteredData.map(row => row.commentComplexity);

                    // Iterate through comments to count matches per category
                    comments.forEach(comment => {
                        for (const [category, keywords] of Object.entries(bag_of_words)) {
                            const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'ig');
                            const matches = comment.match(regex);
                            if (matches) {
                                this.categoryCounts[category] += matches.length;
                            }
                        }
                    });

                    // Remove categories with count 0
                    for (const category in this.categoryCounts) {
                        if (this.categoryCounts[category] === 0) {
                            delete this.categoryCounts[category];
                        }
                    }


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
                console.log(`Average complexity for ${mappedImageName}: ${complexityData.avgComplexity}`);
                //print to <p>
                this.averageValue = complexityData.avgComplexity;

                this.analyzeCommentComplexity(mappedImageName);


                this.commentComplexity = '';

                d3.csv('/testResult.csv').then(data => {
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
                    Object.entries(selectedCheckboxesCounts).forEach(([checkbox, count]) => {
                        console.log(`${checkbox}=${count}`);
                        // print comment if not empty
                        if (checkbox === 'Other (please comment)' && count > 0) {
                            filteredRows.forEach(row => {
                                if (row.comment && row.comment.trim() !== '') {
                                    console.log(`Comment: ${row.comment}`);
                                }
                            });
                        }
                    });


                    // Prepare data for bar chart
                    const dataForChart = Object.entries(selectedCheckboxesCounts).map(([checkbox, count]) => {
                        return { checkbox, count };
                    });

                    // Rename comment bar
                    dataForChart.forEach(d => {
                        if (d.checkbox === 'Other (please comment)') {
                            d.checkbox = 'Other';
                        }
                    });

                    // Sort data for bar chart by count
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
                        .attr('fill', '#77ba9e');

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

                }).catch(error => {
                    console.error('Error loading dataset:', error);
                });
            }
        }

    }
};
</script>