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

    <div class="container justify-content-center"
        style="margin-top: 6rem; border: 1px solid #DDD; width: 50rem; height: 30rem; overflow: hidden;">
        <div id="bar-chart"></div>
        <button @click.prevent="firstTest" style="margin-left:30rem; position:absolute;" type="button"
            class="btn btn-outline-secondary">First test</button>
        <button @click.prevent="secondTest" style="margin-left:30rem; position:absolute; margin-top: 3rem;" type="button"
            class="btn btn-outline-secondary">Second test</button>
        <button @click.prevent="thirdTest" style="margin-left:30rem; position:absolute; margin-top: 6rem;" type="button"
            class="btn btn-outline-secondary">Third test</button>
    </div>
</template>


<script>
import * as d3 from 'd3';
export default {
    name: "FriendTest",
    data() {
        return {
            averageComplexities: [],
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
            const imageNames = ['image6','image22','image20','image19','image26','image14','image5','image8','image2','image21','image13','image3','image24','image10','image17','image12','image11','image4','image9','image1','image7','image15','image16','image23','image18','image25',];
            this.averageComplexities.sort((a, b) => imageNames.indexOf(a.key) - imageNames.indexOf(b.key));

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
            const imageNames = ['image22','image20','image6','image8','image5','image18','image21','image19','image26','image13','image16','image23','image2','image1','image3','image12','image4','image17','image15','image9','image14','image7','image11','image24','image25','image10'];
            this.averageComplexities.sort((a, b) => imageNames.indexOf(a.key) - imageNames.indexOf(b.key));

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