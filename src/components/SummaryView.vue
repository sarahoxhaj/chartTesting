<template>
    <nav class="navbar navbar-default navbar-fixed-top" style="background-color: #C4E1D5; padding: 0.5rem 0; height: 40px;">
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