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
                    <a href="#" @click.prevent="deviation" style="margin-bottom:2px;"> Rating deviation </a>
                    <a href="#" @click.prevent="summary"> Summary </a>
                </div>
            </div>


            <div class="container d-flex justify-content-center flex-column flex-md-row align-items-center">
                <h5 class="text-center text-md-left">Complexity table</h5>
            </div>

            <div class="pagination" style="margin-top:0.2rem; position:absolute; margin-left:75rem;">
                <button @click="prevPage" :disabled="currentPage === 0"
                    class="btn btn-outline-secondary btn-sm btn-sm">Previous</button>
                <button @click="nextPage" :disabled="currentPage === maxPage"
                    class="btn btn-outline-secondary btn-sm btn-sm">Next</button>
                <span style="margin-left:10px; margin-top:0.2rem;">Page {{ currentPage + 1 }} of {{ maxPage + 1 }}</span>
            </div>
        </nav>

        <div style="margin-top:1rem;">
            <table
                style="border: 1px solid black; border-collapse: collapse; width:97%; margin-left:20px; margin-bottom:30px;">
                <thead>
                    <tr>
                        <th style="width: 2%;">Nr.</th>
                        <th>Image</th>
                        <th style="width: 10%;">Complexity score</th>
                        <th style="width: 20%;">Graph feature</th>
                        <th>Complexity elements</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in indexedItems" :key="item.displayIndex" style="border: 1px solid black;">
                        <td style="border: 1px solid black;">{{ item.displayIndex }}</td>
                        <td style="border: 1px solid black; width: 25rem; height: 15rem;">
                            <img :src="require(`@/assets/${item.key}.png`)" :alt="item.key"
                                style="max-width: 100%; max-height: 100%;">
                        </td>
                        <td style="border: 1px solid black; width: 20rem; height: 15rem;">
                            <p>Average score: {{ item.avgComplexity }}</p>
                            <div :id="'complexityScores-chart-' + item.displayIndex"></div>
                        </td>
                        <td style="border: 1px solid black;">
                            <div :id="'graphFeatureChart-' + item.displayIndex"></div>
                        </td>
                        <td style="border: 1px solid black;">
                            <div :id="'categoryCountsChart-' + item.displayIndex"></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
export default {
    name: "ComplexityTable",
    data() {
        return {
            items: [],
            currentPage: 0,
            itemsPerPage: 3,
        };
    },
    computed: {
        maxPage() {
            return Math.ceil(this.items.length / this.itemsPerPage) - 1;
        },
        displayedItems() {
            const startIndex = this.currentPage * this.itemsPerPage;
            return this.items.slice(startIndex, startIndex + this.itemsPerPage);
        },
        indexedItems() {
            const startIndex = this.currentPage * this.itemsPerPage;
            return this.displayedItems.map((item, index) => {
                const adjustedIndex = Math.floor((startIndex + index) / 3) * 3 + (index % 3) + 1;
                return { ...item, displayIndex: adjustedIndex };
            });
        }
    },
    created() {
        this.calculateAverageComplexity();
    },
    methods: {
        changeViewMatrix() {
            this.$router.push('/complexityMatrix');
        },
        summary() {
            this.$router.push('/summaryView');
        },
        testOverview() {
            this.$router.push('/resultView');
        },
        deviation() {
            this.$router.push('/ratingDeviation');
        },
        calculateAverageComplexity() {
            d3.csv('/pilotTest.csv').then(data => {
                data.forEach(d => {
                    d.complexity = +d.complexity;
                    d.key = d.key.replace(/^image(\d+)$/, (match, p1) => {
                        return `${p1.padStart(2, '0')}vis`;
                    });
                });

                const groupedData = d3.group(data, d => d.key);
                const averageComplexities = Array.from(groupedData, ([key, values]) => {
                    const avgComplexity = d3.mean(values, d => d.complexity);
                    const complexities = values.map(d => d.complexity); // Get all complexities for the chart
                    return { key, avgComplexity: Math.round(avgComplexity * 10) / 10, complexities };
                });
                averageComplexities.sort((a, b) => b.avgComplexity - a.avgComplexity);
                this.items = averageComplexities;

                // After setting items, calculate and print selected checkboxes counts
                this.items.forEach(item => {
                    const filteredRows = data.filter(row => row.key === item.key);
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
                    item.graphFeatureCounts = selectedCheckboxesCounts;
                });

                this.$nextTick(() => {
                    this.createBarCharts();
                    this.createGraphFeatureCharts();
                });
                this.logCommentComplexity(data);
            }).catch(error => {
                console.error('Error loading dataset:', error);
            });
        },
        logCommentComplexity(data) {
            const keywordsAnalysis = {
                'context': ['abstract', 'unclear', 'dont get', 'do not understand', 'hard to understand', 'confused', 'nothing is clear', 'unclear how to read', 'not clear', 'presentation', 'context', 'title', 'titles', 'domain', 'tell', 'missing information', 'missing context', 'no context'],
                'separation': ['separation', 'touching', 'comparing', 'comparison', 'spacing', 'a lot of bars', 'number of bars', 'many bars', 'compare', 'gaps', 'close', 'compare', 'thin lines', 'thin line'],
                'axis and labels': ['label', 'labels', 'axis', 'axes', 'labeling'],
                'use of color': ['color', 'colour', 'colors', 'colours', 'fade', 'fading', 'shade', 'shading'],
                'missing legend': ['legend', 'legends', 'represents', 'represent', 'representing', 'stand for', 'stands for', 'categories'],
                'clutter': ['crowded', 'cant read', 'hard to see', 'hard to read', 'occupied', 'dense', 'a lot of information', 'takes time', 'too much information', 'overloaded', 'too much going on', 'unreadable'],
                'small values': ['small values', 'values too small', 'values small', 'small', 'very small', 'cannot be read', 'hard to see', 'readable'],
            };

            // Initialize categoryCounts for each item
            this.items.forEach(item => {
                item.categoryCounts = {};
                Object.keys(keywordsAnalysis).forEach(category => {
                    item.categoryCounts[category] = 0;
                });
            });

            // Iterate through data to count occurrences
            data.forEach(d => {
                for (const [category, keywords] of Object.entries(keywordsAnalysis)) {
                    const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'ig');
                    const matches = d.commentComplexity.match(regex);
                    if (matches) {
                        this.items.forEach(item => {
                            if (item.key === d.key) {
                                item.categoryCounts[category] += matches.length;
                            }
                        });
                    }
                }
            });

            // Update indexedItems to include categoryCounts
            this.indexedItems.forEach(item => {
                const matchingItem = this.items.find(i => i.key === item.key);
                if (matchingItem) {
                    item.categoryCounts = matchingItem.categoryCounts;
                }
            });

            this.$nextTick(() => {
                this.createCategoryCountsCharts();
            });
        },
        createCategoryCountsCharts() {
            const keywordsAnalysis = {
                'context': ['abstract', 'unclear', 'dont get', 'do not understand', 'hard to understand', 'confused', 'nothing is clear', 'unclear how to read', 'not clear', 'presentation', 'context', 'title', 'titles', 'domain', 'tell', 'missing information', 'missing context', 'no context'],
                'separation': ['separation', 'touching', 'comparing', 'comparison', 'spacing', 'a lot of bars', 'number of bars', 'many bars', 'compare', 'gaps', 'close', 'compare', 'thin lines', 'thin line'],
                'axis and labels': ['label', 'labels', 'axis', 'axes', 'labeling'],
                'use of color': ['color', 'colour', 'colors', 'colours', 'fade', 'fading', 'shade', 'shading'],
                'missing legend': ['legend', 'legends', 'represents', 'represent', 'representing', 'stand for', 'stands for', 'categories'],
                'clutter': ['crowded', 'cant read', 'hard to see', 'hard to read', 'occupied', 'dense', 'a lot of information', 'takes time', 'too much information', 'overloaded', 'too much going on', 'unreadable'],
                'small values': ['small values', 'values too small', 'values small', 'small', 'very small', 'cannot be read', 'hard to see', 'readable'],
            };

            this.indexedItems.forEach((item) => {
                const categoryCounts = item.categoryCounts;
                const chartId = `categoryCountsChart-${item.displayIndex}`;
                const svgWidth = 300;
                const svgHeight = 160;
                const margin = { top: 20, right: 20, bottom: 30, left: 40 };
                const width = svgWidth - margin.left - margin.right;
                const height = svgHeight - margin.top - margin.bottom;

                // Remove existing content if any
                d3.select(`#${chartId}`).selectAll('*').remove();

                // Create SVG element
                const svg = d3.select(`#${chartId}`)
                    .append('svg')
                    .attr('width', svgWidth)
                    .attr('height', svgHeight + 70)
                    .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

                // Define categories based on keywordsAnalysis order
                const categories = Object.keys(keywordsAnalysis);

                // Define scales
                const x = d3.scaleBand()
                    .domain(categories)
                    .range([0, width])
                    .padding(0.1);

                const y = d3.scaleLinear()
                    .domain([0, 15]) // Adjust the domain based on your data
                    .range([height, 0]);

                // Create bars
                svg.selectAll('.bar')
                    .data(categories)
                    .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', d => x(d))
                    .attr('width', x.bandwidth())
                    .attr('y', d => y(categoryCounts[d]))
                    .attr('height', d => height - y(categoryCounts[d]))
                    .attr('fill', '#AED2D6');

                // Append x-axis
                svg.append('g')
                    .attr('class', 'x-axis')
                    .attr('transform', `translate(0, ${height})`)
                    .call(d3.axisBottom(x))
                    .selectAll('text')
                    .attr('transform', 'rotate(-45)')
                    .style('text-anchor', 'end');

                // Append y-axis
                svg.append('g')
                    .attr('class', 'y-axis')
                    .call(d3.axisLeft(y).ticks(5));
            });
        },
        createBarCharts() {
            this.indexedItems.forEach((item) => {
                const complexities = item.complexities;
                const chartId = `complexityScores-chart-${item.displayIndex}`;
                const svgWidth = 300;
                const svgHeight = 170;
                const margin = { top: 20, right: 20, bottom: 30, left: 40 };
                const width = svgWidth - margin.left - margin.right;
                const height = svgHeight - margin.top - margin.bottom;

                // Remove existing content if any
                d3.select(`#${chartId}`).selectAll('*').remove();

                // Create SVG element
                const svg = d3.select(`#${chartId}`)
                    .append('svg')
                    .attr('width', svgWidth)
                    .attr('height', svgHeight)
                    .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

                // Count occurrences of each complexity score from 1 to 5
                const complexityCounts = [1, 2, 3, 4, 5].map(value => {
                    return {
                        score: value,
                        count: complexities.filter(d => d === value).length
                    };
                });

                // Define scales
                const x = d3.scaleBand()
                    .domain(complexityCounts.map(d => d.score))
                    .range([0, width])
                    .padding(0.1);

                const y = d3.scaleLinear()
                    .domain([0, 15.5])
                    .range([height, 0]);

                // Create bars
                svg.selectAll('.bar')
                    .data(complexityCounts)
                    .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', d => x(d.score))
                    .attr('width', x.bandwidth())
                    .attr('y', d => y(d.count))
                    .attr('height', d => height - y(d.count))
                    .attr('fill', '#AED2D6');

                // Append x-axis
                svg.append('g')
                    .attr('class', 'x-axis')
                    .attr('transform', `translate(0, ${height})`)
                    .call(d3.axisBottom(x));

                // Append y-axis
                svg.append('g')
                    .attr('class', 'y-axis')
                    .call(d3.axisLeft(y));

                // Append y-axis label
                svg.append("text")
                    .attr("class", "y label")
                    .attr("text-anchor", "end")
                    .attr("y", 2)
                    .attr("dy", "-2.5em")
                    .attr("dx", "0.6em")
                    .attr("transform", "rotate(-90)")
                    .style("font-size", "10px")
                    .text("frequency");

                svg.append("text")
                    .attr("class", "x label")
                    .attr("text-anchor", "end")
                    .attr("x", width + 15)
                    .attr("y", height + 15)
                    .style("font-size", "10px")
                    .text("score");
            });
        },
        // simple, grouped, stacked, nested, dot bar chart, radial, no gaps, 3D, embellished, error bars, Values/Axes, legend, labels, background, monochrome, small values, gantt chart, box plot, other
        createGraphFeatureCharts() {
            this.indexedItems.forEach((item) => {
                const graphFeatures = item.graphFeatureCounts;
                const chartId = `graphFeatureChart-${item.displayIndex}`;
                const svgWidth = 300;
                const svgHeight = 160;
                const margin = { top: 20, right: 20, bottom: 30, left: 40 };
                const width = svgWidth - margin.left - margin.right;
                const height = svgHeight - margin.top - margin.bottom;
                // Remove existing content if any
                d3.select(`#${chartId}`).selectAll('*').remove();

                // Create SVG element
                const svg = d3.select(`#${chartId}`)
                    .append('svg')
                    .attr('width', svgWidth)
                    .attr('height', svgHeight + 70)
                    .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

                const customOrder = [
                    'Simple - 1D', 'Grouped', 'Stacked', 'Nested 1', 'Dot Bar Chart',
                    'Radial', 'No gaps 2', '3D', 'Embellished', 'Error bars',
                    'Missing labels', 'Missing legend', 'Background element', 'Missing values / axes',
                    'Monochrome', 'Small values', 'Gantt chart', 'Box plot', 'Other (please comment)'
                ];

                // Merge all labels with existing keys
                const keys = Array.from(customOrder);

                // Define custom labels for the bars
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

                const x = d3.scaleBand()
                    .domain(keys.map(key => labels[key] || key)) // Use custom labels if available, else use key
                    .range([0, width])
                    .padding(0.1);

                const y = d3.scaleLinear()
                    .domain([0, 15.5]) // Adjust domain based on your data
                    .range([height, 0]);

                // Create bars
                svg.selectAll('.bar')
                    .data(keys)
                    .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', d => x(labels[d] || d)) // Use custom label if available, else use key
                    .attr('width', x.bandwidth())
                    .attr('y', d => y(graphFeatures[d] || 0)) // Use graphFeatures[d] if available, else 0
                    .attr('height', d => height - y(graphFeatures[d] || 0)) // Use graphFeatures[d] if available, else 0
                    .attr('fill', '#AED2D6');

                // Append x-axis
                svg.append('g')
                    .attr('class', 'x-axis')
                    .attr('transform', `translate(0, ${height})`)
                    .call(d3.axisBottom(x))
                    .selectAll('text')
                    .attr('transform', 'rotate(-90)')
                    .attr("dx", "-1em")
                    .attr("dy", "-0.6em")
                    .style('text-anchor', 'end');

                // Append y-axis
                svg.append('g')
                    .attr('class', 'y-axis')
                    .call(d3.axisLeft(y).ticks(5));
            });
        },
        nextPage() {
            if (this.currentPage < this.maxPage) {
                this.currentPage++;
                this.$nextTick(() => {
                    this.createBarCharts();
                    this.createGraphFeatureCharts();
                    this.createCategoryCountsCharts();
                });
            }
        },
        prevPage() {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.$nextTick(() => {
                    this.createBarCharts();
                    this.createGraphFeatureCharts();
                    this.createCategoryCountsCharts();
                });
            }
        },
    }
};
</script>

<style scoped>
.pagination {
    margin-top: 10px;
}

.pagination button {
    cursor: pointer;
    margin-right: 5px;
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
