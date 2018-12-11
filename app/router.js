import {Router, Route, Redirect, IndexRedirect, IndexRoute, browserHistory} from 'react-router'

// import application pages
import DefaultsIndexPage from '@core/pages/defaults/index'
import WhiteboardIndexPage from '@core/pages/whiteboard/index'
import WhiteboardSessionPage from '@core/pages/whiteboard/session'
import WhiteboardRuntimePage from '@core/pages/whiteboard/runtime'
import WhiteboardResultsPage from '@core/pages/whiteboard/results'
import ClassroomJoinPage from '@core/pages/classroom/join'
import ClassroomLowstartPage from '@core/pages/classroom/lowstart'
import ClassroomDoPage from '@core/pages/classroom/do'
import ClassroomResultsPage from '@core/pages/classroom/results'
import ClassroomReportPage from '@core/pages/classroom/report'

export default <Router history={browserHistory}>
  <Route path="/">
    <IndexRedirect to="whiteboard"/>
    <Route path="whiteboard">
      <IndexRoute component={WhiteboardIndexPage}/>
      <Route path="session/:token" component={WhiteboardSessionPage}/>
      <Route path="runtime/:token" component={WhiteboardRuntimePage}/>
      <Route path="results/:token" component={WhiteboardResultsPage}/>
    </Route>
    <Route path="classroom">
      <Route path="join/:session_token" component={ClassroomJoinPage}/>
      <Route path="lowstart/:token" component={ClassroomLowstartPage}/>
      <Route path="do/:token" component={ClassroomDoPage}/>
      <Route path="results/:token" component={ClassroomResultsPage}/>>
      <Route path="report/:token" component={ClassroomReportPage}/>>
    </Route>
  </Route>
</Router>;
