import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import Board from './container/Board';
import Chart from './container/Chart';

const Boards = ({ match }) => (
<div>
    <Route path={`${match.url}/:boardId/:sprintId`} component={ Board }/>
    <Route path={`${match.url}/:boardId/:chartId`} component={ Chart }/>
</div>
);

const SingleBoard = ({ match }) => (
<div>
    <Route path={`${match.url}/:boardId/:sprintId`} component={ Board }/>
</div>
);

const SingleChart = ({ match }) => (
<div>
    <Route path={`${match.url}/:chartId`} component={ Chart }/>
</div>
);

const App = () => (
  <Router>
    <div>
      <Route path="/boards" component={ Boards }/>
      <Route path="/single-board" component={ SingleBoard }/>
      <Route path="/single-chart" component={ SingleChart }/>
    </div>
  </Router>
)
export default App;
