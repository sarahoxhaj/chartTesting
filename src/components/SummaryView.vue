<template>
    <nav class="navbar navbar-default navbar-fixed-top" style="background-color: #C4E1D5; padding: 0.5rem 0; height: 40px;">
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
                <a href="#" @click.prevent="changeViewTable"> Complexity table </a>
                <a href="#" @click.prevent="error" style="margin-bottom:2px;"> Error evaluation </a>
                <a href="#" @click.prevent="friendTest" style="margin-bottom:2px;"> Friend test </a>
            </div>
        </div>

        <div class="container d-flex justify-content-center flex-column flex-md-row align-items-center">
            <h5 class="text-center text-md-left">Summary of complexity criteria</h5>
        </div>
    </nav>
    <div class="row" style="max-width: 100%;">
        <div class="col" id="total-category-chart" style="margin-left: 10px; margin-top:7rem;">
        </div>
        <div class="col" style="margin-right:3rem; text-align: left; margin-top:4.5rem;">
            After analyzing the data retrieved from the pilot test where 15 people participated, we organized the result in
            three big groups.
            <ul>
                <li>First group</li>
                <ul>
                    <li>In the first group are included the most common elements that add to the complexity of a bar chart.
                        <i>Axis and labels</i> which a value of 169 mainly includes issues of missing labels, misleading and
                        confusing axes values and not being able to assign a value to the bars. <i>Context</i> addresses
                        difficulties in understanding the domain of the visualized data. This happens in cases where there
                        is missing information about the context fo the chart and the viewer does not understand what is
                        being shown.
                    </li>
                </ul>
                <li>Second group</li>
                <ul>
                    <li>This group consists of <i>use of color</i> and <i>missing legend</i>. While the first one has a
                        value of 60 and represents issues regarding the used colors in the chart to make some distinction
                        between different bars and categories, the second one, with a value of 50, is about not knowing what
                        these features (colors, groups, categories) stand for.</li>
                </ul>
                <li>Third group</li>
                <ul>
                    <li>In the third and last group, we include <i>clutter</i>, <i>small values</i> and <i>separation</i>.
                        Clutter, which has a value of 39, focuses on cases when the viewer is provided with a 'dense' chart
                        overloaded with information and it can be hard to 'read' the
                        visualized data. Small values, with a value of 36, represents cases
                        where the values represented in the chart are so small, the viewer has difficulties reading and
                        noticing them. Lastly, separation (28) stands for issues occurring when there is little to no
                        separation between the
                        bars in the chart, making comparison hard.</li>
                </ul>

            </ul>
        </div>
    </div>
</template>
<script>
import * as d3 from 'd3';

export default {
    name: "summaryView",
    data() {
        return {
            categoryCounts: {},
        };
    },
    created() {
        this.analyzeAllComments();
    },
    methods: {
        changeViewMatrix() {
            this.$router.push('/complexityMatrix');
        },
        changeViewTable() {
            this.$router.push('/complexityTable');
        },
        testOverview() {
            this.$router.push('/resultView');
        },
        deviation() {
            this.$router.push('/ratingDeviation');
        },
        error() {
            this.$router.push('/errorEvaluation');
        },
        friendTest(){
            this.$router.push('/friendTest');
        },
        analyzeAllComments() {
            d3.csv('/pilotTest.csv').then(data => {
                const keywordsAnalysis = {
                    'context': ['abstract', 'unclear', 'dont get', 'do not understand', 'hard to understand', 'confused', 'nothing is clear', 'unclear how to read', 'not clear', 'presentation', 'context', 'title', 'titles', 'domain', 'tell', 'missing information', 'missing context', 'no context'],
                    'separation': ['separation', 'touching', 'comparing', 'comparison', 'spacing', 'a lot of bars', 'number of bars', 'many bars', 'compare', 'gaps', 'close', 'compare', 'thin lines', 'thin line'],
                    'axis and labels': ['label', 'labels', 'axis', 'axes', 'labeling'],
                    'use of color': ['color', 'colour', 'colors', 'colours', 'fade', 'fading', 'shade', 'shading'],
                    'missing legend': ['legend', 'legends', 'represents', 'represent', 'representing', 'stand for', 'stands for', 'categories'],
                    'clutter': ['crowded', 'unstructured', 'cant read', 'hard to see', 'more time', 'hard to read', 'occupied', 'takes a long time', 'dense', 'a lot of information', 'takes time', 'too much information', 'overloaded', 'too much going on', 'unreadable'],
                    'small values': ['small values', 'values too small', 'values small', 'small', 'very small', 'cannot be read', 'hard to see', 'readable', 'hard to read'],
                };

                this.categoryCounts = Object.fromEntries(Object.keys(keywordsAnalysis).map(category => [category, 0]));

                data.forEach(row => {
                    const comment = row.commentComplexity || '';
                    for (const [category, keywords] of Object.entries(keywordsAnalysis)) {
                        const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'ig');
                        const matches = comment.match(regex);
                        if (matches) {
                            this.categoryCounts[category] += matches.length;
                        }
                    }
                });

                for (const category in this.categoryCounts) {
                    if (this.categoryCounts[category] === 0) {
                        delete this.categoryCounts[category];
                    }
                }

                this.createBarChart();
            }).catch(error => {
                console.error('Error reading dataset:', error);
            });
        },
        createBarChart() {
            const categoryData = Object.entries(this.categoryCounts).map(([category, count]) => {
                return { category, count };
            });

            categoryData.sort((a, b) => b.count - a.count);

            d3.select('#total-category-chart').selectAll('*').remove();

            const svgWidth = 600;
            const svgHeight = 480;
            const margin = { top: 20, right: 20, bottom: 90, left: 40 };
            const width = svgWidth - margin.left - margin.right;
            const height = svgHeight - margin.top - margin.bottom;

            const svg = d3.select('#total-category-chart')
                .append('svg')
                .attr('width', svgWidth)
                .attr('height', svgHeight)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            const x = d3.scaleBand()
                .range([0, width])
                .padding(0.1)
                .domain(categoryData.map(d => d.category));

            const y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(categoryData, d => d.count)]);

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

            svg.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x))
                .selectAll('text')
                .attr('transform', 'rotate(-45)')
                .style('text-anchor', 'end');

            svg.append('g')
                .attr('class', 'y-axis')
                .call(d3.axisLeft(y).ticks(20));

            const tooltip = svg.append('text')
                .attr('class', 'tooltip')
                .style('opacity', 0)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px');

            bars.on('mouseover', function (event, d) {
                const bar = d3.select(this);
                tooltip.attr('x', +bar.attr('x') + +bar.attr('width') / 2)
                    .attr('y', +bar.attr('y') - 5)
                    .text(d.count)
                    .style('opacity', 1);
            })
                .on('mouseout', () => tooltip.style('opacity', 0));

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