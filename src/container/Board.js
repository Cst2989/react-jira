import React, { Component } from 'react';
import './Board.css';
import axios from 'axios';
import Issue from '../components/Issue';
var Loader = require('halogen/PulseLoader');
class Board extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            id: this.props.match.params.boardId,
            Rid: this.props.match.params.sprintId,
            completedIssues: [],
            nrCompleted: 0,
            pipelineIssues: [],
            nrPipeline: 0,
            inProgressIssues:[],
            nrProgress: 0,
            details: '',
            days: 0
        };
    }

    componentDidMount() {
        axios.get('http://localhost:8000?id=' + this.state.id+'&Rid='+ this.state.Rid).then(res => {
            let pipeline = [];
            let inProgress = [];
            let completed = [];
            let nrPipeline = 0;
            let nrProgress = 0;
            let nrCompleted = 0;
            res.data.issues.forEach( issue => {
                if (issue.fields.status.name === 'In Progress') {
                    inProgress.push(issue);
                    nrProgress++;
                }
                if (issue.fields.status.name === 'To Do') {
                    pipeline.push(issue);
                    nrPipeline++;
                }
                if (issue.fields.status.name === 'Done') {
                    completed.push(issue)
                    nrCompleted++;
                }
            });
            let days = this.nextSprint(res.data.endDate);
            this.setState({
                isLoaded: true,
                completedIssues: completed,
                nrCompleted: nrCompleted,
                pipelineIssues: pipeline,
                nrPipeline: nrPipeline,
                inProgressIssues: inProgress,
                nrProgress: nrProgress,
                details: res.data.name,
                days: days
            });
        });
    }

    //we dont need this because jira gives us the remaining days
    nextSprint(sprintEndDate) {
        let oneDay = 24*60*60*1000;
        //the day we are now
        var now = new Date();
        let endDate = new Date(sprintEndDate);
        // the difference between now and the end of sprint
        return Math.round(Math.abs((endDate.getTime() - now.getTime())/(oneDay)));

    }
    spellDays() {
        let x = this.state.days === 1 ? 'day' : 'days';
        return x;
    }
    render() {
        if (!this.state.isLoaded) {
            return <Loader className="spinner" color="#26A65B" size="32px" margin="4px"/>;
        }
        else {
            return (
                <div className="Board">
                    <div className="Board-header">
                        <h1>Board: { this.state.details } - {this.state.days} { this.spellDays() } remaining</h1>
                    </div>
                    <div className="sprint-board">
                        <div className="col pipeline">
                            <h2 className="uppercase">In Pipeline({ this.state.nrPipeline }):</h2>
                            <div className="pipe">
                                {this.state.pipelineIssues.map(issue =>
                                    <Issue key={ issue.id } id={ issue.key } info={ issue.fields }/>
                                )}
                            </div>
                        </div>
                        <div className="col in-progress">
                            <h2 className="uppercase">In progress({ this.state.nrProgress }):</h2>
                            <div className="pipe">
                                {this.state.inProgressIssues.map(issue =>
                                    <Issue key={ issue.id } id={ issue.key } info={ issue.fields }/>
                                )}
                            </div>
                        </div>
                        <div className="col done">
                            <h2 className="uppercase">Done({ this.state.nrCompleted }):</h2>
                            <div className="pipe">
                                {this.state.completedIssues.map(issue =>
                                    <Issue key={ issue.id } id={ issue.key } info={ issue.fields }/>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

    }
}

export default Board;
