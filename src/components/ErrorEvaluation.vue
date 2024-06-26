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
                    <a href="#" @click.prevent="testOverview" style="margin-bottom:2px;"> Test overview </a>
                    <a href="#" @click.prevent="changeViewMatrix" style="margin-bottom:2px;"> Complexity matrix </a>
                    <a href="#" @click.prevent="changeView" style="margin-bottom:2px;"> Complexity table </a>
                    <a href="#" @click.prevent="deviation" style="margin-bottom:2px;"> Rating deviation </a>
                    <a href="#" @click.prevent="summary"> Summary </a>
                </div>
            </div>
            <h5 class="my-0 mr-md-auto" style="margin-left:37rem; position:absolute;">Error evaluation</h5>
            <div style="margin-left:47rem; position:absolute;">
                <svg @click="handleSvgClickInfo" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor"
                    class="bi bi-info-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path
                        d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg>
            </div>
        </div>
    </nav>


    <div id="bar-chart" style="margin-left:26rem; margin-top:5rem; border: 1px solid #DDD; width: 42rem; height: 30rem;">
    </div>
</template>


<script>
import * as d3 from 'd3';
export default {
    name: "ErrorEvaluation",
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
        testOverview() {
            this.$router.push('/resultView');
        },
        changeView() {
            this.$router.push('/ComplexityTable');
        },
        summary() {
            this.$router.push('/summaryView');
        },
        changeViewMatrix() {
            this.$router.push('/complexityMatrix');
        },
        deviation() {
            this.$router.push('/ratingDeviation');
        },
        handleSvgClickInfo() {
            alert("This is an error histogram showing the total number a feature has been selected and the amount of times it has been selected incorrectly (red bar).")
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
                const filteredData = data.filter(row => row.key === imageName);
                console.log(filteredData);
            }).catch(error => {
                console.error('Error reading dataset:', error);
            });
        },
        printAverageComplexity() {
            const featuresAssigned = {
                'image1': 'Grouped, No gaps, Missing legend, Background element',
                'image2': 'Stacked, Nested 1, No gaps 2, Background element, Small values, Missing axis-label',
                'image3': 'Grouped, Embellished, Missing legend, Background element',
                'image4': 'Grouped, No gaps 2, Error bars',
                'image5': 'Stacked, Radial, Embellished, No gaps 2, Background element, Small values',
                'image6': 'Grouped, 3D, Embellished, Background element, Small values',
                'image7': 'Simple - 1D, Grouped',
                'image8': 'Nested 1, Background element, Grouped, Missing legend',
                'image9': 'Gantt chart, Background element, Grouped',
                'image10': 'Simple - 1D, No gaps 2, Background element, Monochrome, Small values',
                'image11': 'Simple - 1D, Grouped, Missing legend, Background element',
                'image12': 'Grouped, Stacked, Small values, Background element',
                'image13': 'Grouped, No gaps 2, Missing axis-label, Missing legend, Small values',
                'image14': 'Simple - 1D, Embellished, Missing axis-label, Missing legend, Monochrome, Background element',
                'image15': 'Grouped, No gaps 2, Background element, Small values, Monochrome',
                'image16': 'Simple - 1D, Background element, Monochrome',
                'image17': 'Simple - 1D, Dot bar chart, Missing axis-label, Missing legend, Monochrome',
                'image18': 'Box plot, Missing legend, Error bars',
                'image19': 'Grouped, No gaps 2, Small values, Simple - 1D',
                'image20': 'Grouped, 3D, Missing legend',
                'image21': 'Grouped, Box plot, Error bars, Monochrome, Small values',
                'image22': 'Grouped, 3D, Embellished, Missing axis-label, Missing legend, Background element, Small values',
                'image23': 'Stacked, Background element',
                'image24': 'Simple - 1D, Grouped, Missing legend, Background element, Monochrome',
                'image25': 'Grouped, 3D, Embellished, Background element',
                'image26': 'Radial, No gaps 2, Missing axis-label, Missing legend, Small values',
            };

            const featureCount = {}; // Initialize feature count object

            const incorrectFeatureCount = {};

            // Process each image asynchronously
            const processImage = (imageName) => {
                return new Promise((resolve, reject) => {
                    const mappedImageName = this.mapImageName(imageName);
                    const complexityData = this.averageComplexities.find(item => item.key === mappedImageName);
                    this.averageValue = complexityData.avgComplexity;
                    this.analyzeCommentComplexity(mappedImageName);
                    this.commentComplexity = '';

                    d3.csv('/pilotTest.csv').then(data => {
                        const filteredData = data.filter(row => row.key === mappedImageName);

                        const selectedCheckboxesCounts = {};
                        filteredData.forEach(row => {
                            const parsedCheckboxes = JSON.parse(row.selectedCheckboxes);
                            parsedCheckboxes.forEach(checkbox => {
                                if (!selectedCheckboxesCounts[checkbox]) {
                                    selectedCheckboxesCounts[checkbox] = 0;
                                }
                                selectedCheckboxesCounts[checkbox]++;
                            });
                        });

                        const assignedFeatures = (featuresAssigned[mappedImageName] || '').split(', ').map(feature => feature.trim());

                        Object.keys(selectedCheckboxesCounts).forEach(checkbox => {
                            if (!featureCount[checkbox]) {
                                featureCount[checkbox] = 0;
                            }
                            featureCount[checkbox] += selectedCheckboxesCounts[checkbox];

                            // Count incorrect selections
                            if (selectedCheckboxesCounts[checkbox] > 0 && !assignedFeatures.includes(checkbox)) {
                                if (!incorrectFeatureCount[checkbox]) {
                                    incorrectFeatureCount[checkbox] = 0;
                                }
                                incorrectFeatureCount[checkbox] += selectedCheckboxesCounts[checkbox];
                                console.log(`'${mappedImageName}' was incorrectly selected for '${checkbox}', count: ${selectedCheckboxesCounts[checkbox]}`);
                            }
                        });
                        resolve();
                    }).catch(error => {
                        reject(`Error loading dataset for ${mappedImageName}: ${error}`);
                    });
                });
            };

            const imageNames = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6', 'image7', 'image8', 'image9', 'image10', 'image11', 'image12', 'image13', 'image14', 'image15', 'image16', 'image17', 'image18', 'image19', 'image20', 'image21', 'image22', 'image23', 'image24', 'image25', 'image26'];

            const processAllImages = async () => {
                for (const imageName of imageNames) {
                    try {
                        await processImage(imageName);
                    } catch (error) {
                        console.error(error);
                    }
                }

                // Create the bar chart
                const svgWidth = 640;
                const svgHeight = 470;
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

                // Extract all features from featuresAssigned
                let allFeatures = Object.values(featuresAssigned)
                    .map(str => str.split(', '))
                    .flat()
                    .map(str => str.trim())
                    .filter(str => str !== '');

                // Remove 'No gaps' from allFeatures
                allFeatures = allFeatures.filter(feature => feature !== 'No gaps');

                // After calculating feature counts, sort allFeatures based on featureCount values
                const sortedFeatures = allFeatures.sort((a, b) => featureCount[b] - featureCount[a]);

                // Use allFeatures as the domain for x axis
                const x = d3.scaleBand()
                    .domain(sortedFeatures)
                    .range([0, width])
                    .padding(0.1);

                const y = d3.scaleLinear()
                    .domain([0, 160]) // Adjust domain as needed
                    .range([height, 0]);

                // Specify the number of ticks for the y-axis
                const yAxis = d3.axisLeft(y)
                    .ticks(15); // Adjust the number of ticks as needed

                // Append the y-axis to your SVG
                svg.append('g')
                    .call(yAxis);

                // Create bars including both correct and incorrect counts
                svg.selectAll('.bar')
                    .data(sortedFeatures)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('x', d => x(d))
                    .attr('width', x.bandwidth())
                    .attr('y', d => y(featureCount[d] || 0))
                    .attr('height', d => height - y(featureCount[d] || 0))
                    .attr('fill', '#AED2D6');

                // Create bars for incorrect counts (if available)
                svg.selectAll('.incorrect-bar')
                    .data(sortedFeatures)
                    .enter()
                    .append('rect')
                    .attr('class', 'incorrect-bar')
                    .attr('x', d => x(d))
                    .attr('width', x.bandwidth())
                    .attr('y', d => y(incorrectFeatureCount[d] || 0))
                    .attr('height', d => height - y(incorrectFeatureCount[d] || 0))
                    .attr('fill', 'red')
                    .style('opacity', 0.5); // Adjust opacity or styling as needed

                svg.append('g')
                    .attr('transform', `translate(0,${height})`)
                    .call(d3.axisBottom(x))
                    .selectAll('text')
                    .attr('transform', 'rotate(-45)')
                    .style('text-anchor', 'end');

                svg.append('g')
                    .call(d3.axisLeft(y).ticks(10));

                svg.append("text")
                    .attr("class", "y label")
                    .attr("text-anchor", "end")
                    .attr("y", 2)
                    .attr("dy", "-2.5em")
                    .attr("dx", "0.5em")
                    .attr("transform", "rotate(-90)")
                    .style("font-size", "13px")
                    .text("frequency");

                console.log('Total Feature counts:', featureCount);
            };


            processAllImages();
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
