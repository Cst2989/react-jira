import React, {Component} from 'react';
import './Chart.css';
import axios from 'axios';
var Loader = require('halogen/PulseLoader');
var LineChart = require("react-chartjs").Line;
class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.chartId,
            intervalId: 0,
            isLoaded: false,
            data: {},
            componentClasses: ['react-chart'],
            options: {
                bezierCurve : false,
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    ]
                }
            }
        };

    }
    date(time) {
        return new Date(time);
    }
    pointsPerStory(changesPerDate, story) {
        let points = 0
        for (let changes in changesPerDate) {
            if (changesPerDate.hasOwnProperty(changes)) {
                changesPerDate[changes].forEach(change => {
                    if (change['key'] === story && change['statC']) {
                        points += !change['statC']['newValue']
                            ? 0
                            : change['statC']['newValue'];
                    }
                    return 0;
                });
            }
        }
        return points;
    }
    pointsPerDate(changesPerDate, startTime, endTime) {
        let pointsPerDate = {};
        let points = 0;

        for (let changes in changesPerDate) {
            let isBeforeStart = parseInt(changes, 10) <= startTime;
            let key = (isBeforeStart
                ? this.date(startTime).toDateString()
                : this.date(parseInt(changes, 10)).toDateString());
            if (!pointsPerDate.hasOwnProperty(key)) {
                pointsPerDate[key] = [];
            }
            changesPerDate[changes].forEach(change => {
                let isAdded = change['added'];
                let isDone = change['column'] && change['column']['done']
                    ? true
                    : false;
                let story = change['key'];

                if (isAdded || isDone) {
                    points += ((isDone
                        ? -this.pointsPerStory(changesPerDate, story)
                        : this.pointsPerStory(changesPerDate, story)));
                    if (isBeforeStart) {
                        pointsPerDate[key][0] = points;
                    } else {
                        pointsPerDate[key].push(points);
                    }
                }

            })
        }
        let lastKey = this.date(endTime) < new Date()
            ? this.date(endTime).toDateString()
            : new Date().toDateString();
        if (!pointsPerDate.hasOwnProperty(lastKey)) {
            pointsPerDate[lastKey] = [];
            pointsPerDate[lastKey].push(points);
        }
        return pointsPerDate;

    }
    remainingValues(startDate, endDate, pointsPerDate) {
        let dataPoints = []
        let endDateQ = new Date();
        endDateQ = endDateQ.setDate(this.date(endDate).getDate() + 1);
        for (let date = this.date(startDate); date <= endDateQ; date.setDate(date.getDate() + 1)) {
            //console.log(date);
            if (pointsPerDate.hasOwnProperty(date.toDateString()) && date <= new Date()) {
                pointsPerDate[date.toDateString()].forEach((points, index) => {
                    dataPoints.push(points)
                })
            } else {
                if (date <= new Date()) {
                    dataPoints.push(dataPoints[dataPoints.length - 1])
                }
            }
        }
        return dataPoints;
    }

    guideline(startDate, endDate, pointsPerDate) {
        let labels = [];
        let endDateQ = new Date();
        let points = [];
        let startDateQ = this.date(startDate);
        endDateQ = endDateQ.setDate(this.date(endDate).getDate() + 1);
        for (let date = this.date(startDate); date <= endDateQ; date.setDate(date.getDate() + 1)) {
            labels.push(date.toDateString());
        }
        let startValue = pointsPerDate[startDateQ.toDateString()][0];
        let byValue = parseInt(startValue / 9, 10);
        for (let i = startValue; i >= 1; i = i - byValue) {
            points.push(i)
        }
        //we duplicate the points in the weekend because there should be no changes in the weekends
        points.splice(3, 0, points[2]);
        points.splice(3, 0, points[2]);
        points.splice(10, 0, points[9]);
        points.splice(10, 0, points[9]);

        points[points.length-1] = 0;
        return {labels: labels, points: points};
    }
    showChart() {
        this.setState((prevState) => ({
            componentClasses: prevState.componentClasses.length > 1 ? ['react-chart'] : ['react-chart', 'show']
        }));
    }
    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }
    componentDidMount() {
        axios.get('http://localhost:8000?Rid=' + this.state.id + '&chart=1').then(res => {
            let pointsPerDate = this.pointsPerDate(res.data['changes'], res.data['startTime'], res.data['endTime']);
            let remainingValues = this.remainingValues(res.data['startTime'], res.data['endTime'], pointsPerDate);
            let guideline = this.guideline(res.data['startTime'], res.data['endTime'], pointsPerDate);
            let intervalId = setInterval(this.showChart.bind(this), 6000);
            //console.log(guideline);
            //console.log( remainingValues);
            //console.log("p:",pointsPerDate);
            this.setState({
                intervalId: intervalId,
                isLoaded: true,
                data: {
                    labels: guideline['labels'],
                    datasets: [
                        {
                            fillColor: "rgba(220,220,220,0.1)",
				            strokeColor: "rgb(225,0,0)",
				            highlightFill: "rgba(220,220,220,0.75)",
				            highlightStroke: "rgba(220,220,220,1)",
                            data: guideline['points'],
                            borderWidth: 1
                        },
                        {
                            fillColor: "rgba(220,220,220,0.1)",
				            strokeColor: "rgb(0,225,0)",
				            highlightFill: "rgba(220,220,220,0.75)",
				            highlightStroke: "rgba(220,220,220,1)",
                            data: remainingValues,
                            borderWidth: 1
                        }
                    ]
                }
            });
        });
    }
    render() {
        if (!this.state.isLoaded) {
            return <Loader className="spinner" color="#26A65B" size="32px" margin="4px"/>;
        } else {
            return <LineChart className={this.state.componentClasses.join(' ')} data={this.state.data} options={this.state.options} width="1920" height="900"/>
        }
    }
}
export default Chart;
