import React, { Component } from 'react';
import './Issue.css';

class Issue extends Component {
    constructor(props) {
        super(props);
        let reporterAvatar = '';
        let assigneeAvatar = '';

        for (let property in this.props.info.creator.avatarUrls) {
            if (this.props.info.creator.avatarUrls.hasOwnProperty(property)) {
                if (property==='32x32') {
                    reporterAvatar = this.props.info.creator.avatarUrls[property];
                }
            }
        }
        for (let property in this.props.info.assignee.avatarUrls) {
            if (this.props.info.assignee.avatarUrls.hasOwnProperty(property)) {
                if (property==='32x32') {
                    assigneeAvatar = this.props.info.assignee.avatarUrls[property]
                }
            }
        }

        this.state = {
            reporterAvatar: reporterAvatar,
            assigneeAvatar: assigneeAvatar,
        };

    }
    render() {
        return (
            <div className={"issue-block " + this.props.info.priority.name }>
                <div className="header">
                    <div className="type"><img src={ this.props.info.issuetype.iconUrl } alt={ this.props.info.issuetype.description } /></div>
                    <div className="task-id">{ this.props.id }</div>
                    <div className="priority"><img className="priority-img" src={ this.props.info.priority.iconUrl } alt={ this.props.info.priority.name } /> { this.props.info.priority.name }</div>
                    <div className="assignee">
                        <div className="avatar">
                            <img src={ this.state.assigneeAvatar } alt={ this.props.info.assigneeName } />
                        </div>
                        <div className="name">{ this.props.info.assignee.displayName }</div>
                    </div>
                </div>
                <div className="body">
                    <div className="summary">{ this.props.info.summary }</div>
                    <div className="reporter">
                        <div className="avatar">
                            <img src={ this.state.reporterAvatar } alt={ this.props.info.creator.displayName } />
                        </div>
                        <div className="name">{ this.props.info.creator.displayName }</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Issue;
