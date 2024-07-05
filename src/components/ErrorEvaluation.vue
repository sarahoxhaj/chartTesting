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
                    <a href="#" @click.prevent="friendTest"> Friend test </a>
                    <a href="#" @click.prevent="summary"> Summary </a>
                </div>
            </div>
            <h5 class="my-0 mr-md-auto" style="margin-left:37rem; position:absolute;">Error evaluation</h5>
        </div>
    </nav>
    <div class="container" style="position:relative; overflow-x: hidden; ">
        <div class="row" style="margin-top:7rem;">
            <div>
                <h6 style="position: absolute; margin-top:-2rem; margin-left:16rem; z-index: 10;">
                    Overall result
                    <svg @click="overallResultInfo" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                        style="margin-left:3px;" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path
                            d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                    </svg>
                </h6>
            </div>

            <div class="col"
                style="margin-left:2rem; border: 1px solid #DDD; margin-right:2rem; width: 55rem; height: 30rem; display: flex; justify-content: center; align-items: center; overflow: hidden; position: relative;">
                <div id="bar-chart"></div>
            </div>

            <h6 style="position: absolute; margin-top:-2rem; margin-left:22rem;">
                Result for each visualization
                <svg @click="handleSvgClickInfo2" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                    style="margin-left:3px;" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path
                        d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg>
            </h6>

            <div class="col"
                style="margin-left:2rem; border: 1px solid #DDD; margin-right:2rem; width: 55rem; height: 30rem; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                <div id="bar-chart2"></div>
            </div>
        </div>
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
        friendTest(){
            this.$router.push('/friendTest');
        },
        deviation() {
            this.$router.push('/ratingDeviation');
        },
        overallResultInfo() {
            alert("This error histogram shows the amount of times a feature has been selected (blue) and the times it has been selected wrong (red).")
        },
        handleSvgClickInfo2() {
            alert("This error histogram shows how many features have been selected for each vis (blue) and how many of them are incorrect (red).")
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
                'image1': 'Grouped, No gaps 2, Missing legend, Background element',
                'image2': 'Stacked, Nested 1, No gaps 2, Background element, Small values, Missing labels',
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
                'image13': 'Grouped, No gaps 2, Missing labels, Missing legend, Small values',
                'image14': 'Simple - 1D, Embellished, Missing labels, Missing values / axes, Missing legend, Monochrome, Background element',
                'image15': 'Grouped, No gaps 2, Background element, Small values, Monochrome',
                'image16': 'Simple - 1D, Background element, Monochrome',
                'image17': 'Simple - 1D, Dot bar chart, Missing labels, Missing values / axes, Missing legend, Monochrome',
                'image18': 'Box plot, Missing legend, Error bars',
                'image19': 'Grouped, No gaps 2, Small values, Simple - 1D',
                'image20': 'Grouped, 3D, Missing legend',
                'image21': 'Grouped, Box plot, Error bars, Monochrome, Small values',
                'image22': 'Grouped, 3D, Embellished, Missing labels, Missing values / axes, Missing legend, Background element, Small values',
                'image23': 'Stacked, Background element',
                'image24': 'Simple - 1D, Grouped, Missing legend, Background element, Monochrome',
                'image25': 'Grouped, 3D, Embellished, Background element',
                'image26': 'Radial, No gaps 2,  Missing labels, Missing values / axes, Missing legend, Small values',
            };

            const featureCount = {}; // Initialize feature count object

            const incorrectFeatureCount = {};
            const uniqueCheckboxes = new Set();
            const uniqueIncorrect = new Set();
            const resultsSet = new Set();
            const resultIncorrect = new Set();

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

                        const uniqueCheckboxesForImage = new Set();

                        const selectedCheckboxesCounts = {};
                        filteredData.forEach(row => {
                            const parsedCheckboxes = JSON.parse(row.selectedCheckboxes);
                            parsedCheckboxes.forEach(checkbox => {
                                uniqueCheckboxes.add(checkbox);
                                uniqueCheckboxesForImage.add(checkbox);
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

                            if (selectedCheckboxesCounts[checkbox] > 0 && !assignedFeatures.includes(checkbox)) {
                                if (checkbox !== 'Other (please comment)') {
                                    if (!incorrectFeatureCount[checkbox]) {
                                        incorrectFeatureCount[checkbox] = 0;
                                    }
                                    incorrectFeatureCount[checkbox] += selectedCheckboxesCounts[checkbox];
                                    uniqueIncorrect.add(checkbox);
                                }
                            }
                        });
                        resultsSet.add({ [mappedImageName]: uniqueCheckboxes.size });
                        resultIncorrect.add({ [mappedImageName]: uniqueIncorrect.size });
                        console.log(`For ${mappedImageName}, a total of ${uniqueCheckboxes.size} unique features are selected and ${uniqueIncorrect.size} of them are incorrect.`);
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

                const dataArray = Array.from(resultsSet);
                dataArray.sort((a, b) => {
                    const nameA = Object.keys(a)[0];
                    const nameB = Object.keys(b)[0];
                    return imageNames.indexOf(nameA) - imageNames.indexOf(nameB);
                });

                const dataArray2 = Array.from(resultIncorrect);
                dataArray2.sort((a, b) => {
                    const nameA = Object.keys(a)[0];
                    const nameB = Object.keys(b)[0];
                    return imageNames.indexOf(nameA) - imageNames.indexOf(nameB);
                });


                const svgWidth = 570;
                const svgHeight = 430;
                const margin = { top: 20, right: 20, bottom: 90, left: 40 };
                const width = svgWidth - margin.left - margin.right;
                const height = svgHeight - margin.top - margin.bottom;



                d3.select('#bar-chart2').selectAll('*').remove();
                const svg2 = d3.select('#bar-chart2')
                    .append('svg')
                    .attr('width', svgWidth)
                    .attr('height', svgHeight)
                    .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

                const x2 = d3.scaleBand()
                    .domain(dataArray.map(d => Object.keys(d)[0]))
                    .range([0, width])
                    .padding(0.1);

                const y2 = d3.scaleLinear()
                    .domain([0, d3.max(dataArray, d => Object.values(d)[0])])
                    .nice()
                    .range([height, 0]);

                svg2.selectAll('.bar')
                    .data(dataArray)
                    .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', d => x2(Object.keys(d)[0]))
                    .attr('width', x2.bandwidth())
                    .attr('y', d => y2(Object.values(d)[0]))
                    .attr('height', d => height - y2(Object.values(d)[0]))
                    .attr('fill', '#AED2D6');

                svg2.selectAll('.incorrect-bar2')
                    .data(dataArray2)
                    .enter()
                    .append('rect')
                    .attr('class', 'incorrect-bar2')
                    .attr('x', d => x2(Object.keys(d)[0]))
                    .attr('width', x2.bandwidth())
                    .attr('y', d => y2(Object.values(d)[0]))
                    .attr('height', d => height - y2(Object.values(d)[0]))
                    .attr('fill', '#EE2A2A')
                    .style('opacity', 0.9);

                // Add x-axis
                svg2.append('g')
                    .attr('transform', `translate(0,${height})`)
                    .call(d3.axisBottom(x2))
                    .selectAll('text')
                    .attr('transform', 'rotate(-45)')
                    .style('text-anchor', 'end')
                    //.attr("dy", "-1em");
                    .attr("dx", "-0.5em");

                // Add y-axis
                svg2.append('g')
                    .call(d3.axisLeft(y2).ticks(10));

                svg2.append("text")
                    .attr("class", "y label")
                    .attr("text-anchor", "end")
                    .attr("y", 2)
                    .attr("dy", "-2.6em")
                    .attr("dx", "0.5em")
                    .attr("transform", "rotate(-90)")
                    .style("font-size", "12px")
                    .text("nr. of features");




                d3.select('#bar-chart').selectAll('*').remove();

                const svg = d3.select('#bar-chart')
                    .append('svg')
                    .attr('width', svgWidth)
                    .attr('height', svgHeight)
                    .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

                let allFeatures = Object.values(featuresAssigned)
                    .map(str => str.split(', '))
                    .flat()
                    .map(str => str.trim())
                    .filter(str => str !== '');

                allFeatures = allFeatures.filter(feature => feature !== 'No gaps');

                const sortedFeatures = allFeatures.sort((a, b) => {
                    return (incorrectFeatureCount[b] || 0) - (incorrectFeatureCount[a] || 0);
                });

                const x = d3.scaleBand()
                    .domain(sortedFeatures)
                    .range([0, width])
                    .padding(0.1);

                const y = d3.scaleLinear()
                    .domain([0, 180])
                    .nice()
                    .range([height, 0]);

                const yAxis = d3.axisLeft(y)
                    .ticks(15);

                svg.append('g')
                    .call(yAxis);

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

                svg.selectAll('.incorrect-bar')
                    .data(sortedFeatures)
                    .enter()
                    .append('rect')
                    .attr('class', 'incorrect-bar')
                    .attr('x', d => x(d))
                    .attr('width', x.bandwidth())
                    .attr('y', d => y(incorrectFeatureCount[d] || 0))
                    .attr('height', d => height - y(incorrectFeatureCount[d] || 0))
                    .attr('fill', '#EE2A2A')
                    .style('opacity', 0.9);

                svg.append('g')
                    .attr('transform', `translate(0,${height})`)
                    .call(d3.axisBottom(x))
                    .selectAll('text')
                    .attr('transform', 'rotate(-45)')
                    .style('text-anchor', 'end')
                    .text(function (d) {
                        if (d === 'Nested 1') {
                            return 'Nested';
                        } else if (d === 'No gaps 2') {
                            return 'No gaps';
                        } else {
                            return d;
                        }
                    });

                svg.append('g')
                    .call(d3.axisLeft(y).ticks(10));

                svg.append("text")
                    .attr("class", "y label")
                    .attr("text-anchor", "end")
                    .attr("y", 2)
                    .attr("dy", "-2.6em")
                    .attr("dx", "0.5em")
                    .attr("transform", "rotate(-90)")
                    .style("font-size", "12px")
                    .text("frequency");

            };
            processAllImages();

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
