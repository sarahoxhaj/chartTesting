<template>
    <nav class="navbar navbar-default navbar-fixed-top" style="background-color: #C4E1D5; padding: 0.5rem 0; height: 40px;">
        <div class="container d-flex justify-content-center flex-column flex-md-row align-items-center">
            <h5 class="text-center text-md-left">Summary of complexity criteria</h5>
        </div>
    </nav>
    <div id="total-category-chart" style="border: 1px solid #DDD; width: 40rem; height: 30rem; margin-top: 2rem; margin-left:40px;">
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
                    'general complexity': ['presentation', 'complex', 'hard to interpret', 'complexity', 'unstructured', 'complicated', 'difficult', 'misleading', 'unclear', 'dont get', 'do not understand', 'hard to understand', 'hard to read', 'confused', 'confusing', 'unclear how to read', 'not clear', 'more time', 'abstract', 'nothing is clear', 'art', 'abstract'],
                    'context': ['context', 'title', 'titles', 'domain', 'tell', 'missing information', 'missing context', 'no context'],
                    'separation': ['separation', 'touching', 'comparing', 'comparison', 'spacing', 'a lot of bars', 'number of bars', 'many bars', 'compare', 'gaps', 'close', 'compare', 'thin lines', 'thin line'],
                    'axis and labels': ['label', 'labels', 'axis', 'axes', 'labeling'],
                    'use of color': ['color', 'colour', 'colors', 'colours', 'fade', 'fading', 'shade', 'shading'],
                    'missing legend': ['legend', 'legends', 'represents', 'represent', 'representing', 'stand for', 'stands for', 'categories'],
                    'clutter': ['crowded', 'cant read', 'hard to see', 'hard to read', 'occupied', 'dense', 'a lot of information', 'takes time', 'too much information', 'overloaded', 'too much going on', 'unreadable'],
                    'small values': ['small values', 'values too small', 'values small', 'small', 'very small', 'cannot be read', 'hard to see', 'readable'],
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

            svg.selectAll('.bar')
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
        }
    }
};
</script>