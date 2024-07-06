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
                    <a href="#" @click.prevent="error" style="margin-bottom:2px;"> Error evaluation </a>
                    <a href="#" @click.prevent="summary"> Summary </a>
                </div>
            </div>
            <h5 class="my-0 mr-md-auto" style="margin-left:37rem; position:absolute;">Friend test</h5>
        </div>
    </nav>
    <div style="position: absolute; margin-top: 2rem; width: 100%; text-align: center;">
        <p id="text-paragraph">Click on the buttons to see the result of each test</p>
    </div>
    <div class="container justify-content-center"
        style="margin-top: 6rem; border: 1px solid #DDD; width: 50rem; height: 30rem; overflow: hidden; position: relative;">
        <div id="bar-chart"></div>
        <button @click.prevent="firstTest" style="position: absolute; right: 1rem; top: 1rem;" type="button"
            class="btn btn-outline-secondary btn-sm">1<sup>st</sup> test</button>
        <button @click.prevent="secondTest" style="position: absolute; right: 1rem; top: 3.5rem;" type="button"
            class="btn btn-outline-secondary btn-sm">2<sup>nd</sup> test</button>
        <button @click.prevent="thirdTest" style="position: absolute; right: 1rem; top: 6rem;" type="button"
            class="btn btn-outline-secondary btn-sm">3<sup>rd</sup> test</button>
    </div>
</template>


<script>
import * as d3 from 'd3';
export default {
    name: "FriendTest",
    data() {
        return {
            averageComplexities: [],
            originalRank: [5, 26, 22, 8, 20, 3, 17, 14, 1, 4, 18, 19, 2, 6, 9, 11, 13, 21, 15, 25, 24, 7, 12, 10, 16, 13],
            firstTestRank: [22, 6, 20, 6, 5, 18, 14, 24, 17, 11, 7, 12, 8, 9, 16, 1, 21, 23, 13, 15, 3, 4, 19, 2, 1, 25],
            secondTestRank: [6, 22, 20, 19, 26, 14, 5, 8, 2, 21, 13, 3, 24, 10, 17, 12, 11, 4, 9, 1, 7, 15, 16, 23, 18, 25],
            thirdTestRank: [22, 20, 6, 8, 5, 18, 21, 19, 26, 13, 16, 23, 2, 1, 3, 12, 4, 17, 15, 9, 14, 7, 11, 24, 25, 10],
        };
    },
    mounted() {
        this.processData();
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
        error() {
            this.$router.push('/errorEvaluation');
        },
        processData() {
            d3.csv('/pilotTest.csv').then(data => {
                data.forEach(d => {
                    d.complexity = +d.complexity;
                });

                const groupedData = d3.group(data, d => d.key);
                const averageComplexities = Array.from(groupedData, ([key, values]) => {
                    const avgComplexity = d3.mean(values, d => d.complexity);
                    return { key, avgComplexity: Math.round(avgComplexity * 10) / 10 };
                });
                averageComplexities.sort((a, b) => b.avgComplexity - a.avgComplexity);
                this.averageComplexities = averageComplexities;

                const result = new Map();
                averageComplexities.forEach(item => {
                    result.set(item.key, item.avgComplexity);
                });

                this.drawBarChart(averageComplexities);
            }).catch(error => {
                console.error('Error loading dataset:', error);
            });
        },
        drawBarChart(dataArray) {
            const svgWidth = 680;
            const svgHeight = 500;
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
                .domain(dataArray.map(d => d.key))
                .range([0, width])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, 5])
                .nice()
                .range([height, 0]);

            svg.selectAll('.bar')
                .data(dataArray)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d.key))
                .attr('width', x.bandwidth())
                .attr('y', d => y(d.avgComplexity))
                .attr('height', d => height - y(d.avgComplexity))
                .attr('fill', '#AED2D6');

            svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll('text')
                .attr('transform', 'rotate(-45)')
                .style('text-anchor', 'end')
                .attr("dx", "-0.5em");

            svg.append('g')
                .call(d3.axisLeft(y).ticks(10));
        },
        firstTest() {
            const imageNames = ['image22', 'image26', 'image20', 'image6', 'image5', 'image18', 'image14', 'image24', 'image17', 'image11', 'image7', 'image12', 'image8', 'image9', 'image16', 'image1', 'image21', 'image23', 'image13', 'image15', 'image3', 'image4', 'image19', 'image2', 'image1', 'image25'];
            this.averageComplexities.sort((a, b) => imageNames.indexOf(a.key) - imageNames.indexOf(b.key));

            const originalRank = this.originalRank.slice();
            const firstTestRank = this.firstTestRank.slice();
            const correlation = this.kendallsTau(originalRank, firstTestRank);
            console.log('first Kendall\'s tau:', correlation);
            document.getElementById('text-paragraph').innerText = 'Total time of 12 min & Kendall`s Tau = ' + correlation.toFixed(3);

            const svg = d3.select('#bar-chart').select('svg').select('g'); // Select the existing SVG group

            const svgWidth = 680;
            const svgHeight = 500;
            const margin = { top: 20, right: 20, bottom: 90, left: 40 };
            const width = svgWidth - margin.left - margin.right;
            const height = svgHeight - margin.top - margin.bottom;

            const x = d3.scaleBand()
                .domain(this.averageComplexities.map(d => d.key))
                .range([0, width])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, 5])
                .nice()
                .range([height, 0]);

            svg.selectAll('.bar-overlay')
                .data(this.averageComplexities)
                .enter().append('rect')
                .attr('class', 'bar-overlay')
                .attr('x', d => x(d.key))
                .attr('width', x.bandwidth())
                .attr('y', d => y(d.avgComplexity))
                .attr('height', d => height - y(d.avgComplexity))
                .attr('fill', '#14884E')
                .style('opacity', 0.4);

            svg.selectAll('.bar-overlay')
                .transition()
                .duration(200)
                .attr('y', d => y(d.avgComplexity))
                .attr('height', d => height - y(d.avgComplexity));
        },
        secondTest() {
            const imageNames = ['image6', 'image22', 'image20', 'image19', 'image26', 'image14', 'image5', 'image8', 'image2', 'image21', 'image13', 'image3', 'image24', 'image10', 'image17', 'image12', 'image11', 'image4', 'image9', 'image1', 'image7', 'image15', 'image16', 'image23', 'image18', 'image25',];
            this.averageComplexities.sort((a, b) => imageNames.indexOf(a.key) - imageNames.indexOf(b.key));

            const originalRank = this.originalRank.slice();
            const secondTestRank = this.secondTestRank.slice();
            const correlation = this.kendallsTau(originalRank, secondTestRank);
            console.log('second Kendall\'s tau:', correlation);
            document.getElementById('text-paragraph').innerText = 'Total time of 6 min & Kendall`s Tau = ' + correlation.toFixed(3);

            const svg = d3.select('#bar-chart').select('svg').select('g'); // Select the existing SVG group

            const svgWidth = 680;
            const svgHeight = 500;
            const margin = { top: 20, right: 20, bottom: 90, left: 40 };
            const width = svgWidth - margin.left - margin.right;
            const height = svgHeight - margin.top - margin.bottom;

            const x = d3.scaleBand()
                .domain(this.averageComplexities.map(d => d.key))
                .range([0, width])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, 5])
                .nice()
                .range([height, 0]);

            svg.selectAll('.bar-overlay')
                .data(this.averageComplexities)
                .enter().append('rect')
                .attr('class', 'bar-overlay')
                .attr('x', d => x(d.key))
                .attr('width', x.bandwidth())
                .attr('y', d => y(d.avgComplexity))
                .attr('height', d => height - y(d.avgComplexity))
                .attr('fill', '#14884E')
                .style('opacity', 0.4);

            svg.selectAll('.bar-overlay')
                .transition()
                .duration(200)
                .attr('y', d => y(d.avgComplexity))
                .attr('height', d => height - y(d.avgComplexity));
        },
        thirdTest() {
            const imageNames = ['image22', 'image20', 'image6', 'image8', 'image5', 'image18', 'image21', 'image19', 'image26', 'image13', 'image16', 'image23', 'image2', 'image1', 'image3', 'image12', 'image4', 'image17', 'image15', 'image9', 'image14', 'image7', 'image11', 'image24', 'image25', 'image10'];
            this.averageComplexities.sort((a, b) => imageNames.indexOf(a.key) - imageNames.indexOf(b.key));

            const originalRank = this.originalRank.slice();
            const thirdTestRank = this.thirdTestRank.slice();
            const correlation = this.kendallsTau(originalRank, thirdTestRank);
            console.log('third Kendall\'s tau:', correlation);
            document.getElementById('text-paragraph').innerText = 'Total time of 7 min & Kendall`s Tau = ' + correlation.toFixed(3);

            const svg = d3.select('#bar-chart').select('svg').select('g'); // Select the existing SVG group

            const svgWidth = 680;
            const svgHeight = 500;
            const margin = { top: 20, right: 20, bottom: 90, left: 40 };
            const width = svgWidth - margin.left - margin.right;
            const height = svgHeight - margin.top - margin.bottom;

            const x = d3.scaleBand()
                .domain(this.averageComplexities.map(d => d.key))
                .range([0, width])
                .padding(0.1);

            const y = d3.scaleLinear()
                .domain([0, 5])
                .nice()
                .range([height, 0]);

            svg.selectAll('.bar-overlay')
                .data(this.averageComplexities)
                .enter().append('rect')
                .attr('class', 'bar-overlay')
                .attr('x', d => x(d.key))
                .attr('width', x.bandwidth())
                .attr('y', d => y(d.avgComplexity))
                .attr('height', d => height - y(d.avgComplexity))
                .attr('fill', '#14884E')
                .style('opacity', 0.4);

            svg.selectAll('.bar-overlay')
                .transition()
                .duration(200)
                .attr('y', d => y(d.avgComplexity))
                .attr('height', d => height - y(d.avgComplexity));
        },
        kendallsTau(originalRank, compareRank) {
            if (originalRank.length !== compareRank.length) {
                throw new Error('Arrays must have the same length');
            }

            let concordant = 0;
            let discordant = 0;

            for (let i = 0; i < originalRank.length; i++) {
                for (let j = i + 1; j < originalRank.length; j++) {
                    const oi = originalRank[i];
                    const oj = originalRank[j];
                    const ii = compareRank.indexOf(oi);
                    const ij = compareRank.indexOf(oj);

                    // Check if pairs are in the same order in both rankings
                    if ((ii < ij && i < j) || (ii > ij && i > j)) {
                        concordant++;
                    } else {
                        discordant++;
                    }
                }
            }
            const n = originalRank.length;
            const kendallsTau = (concordant - discordant) / (0.5 * n * (n - 1));
            return kendallsTau;
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