import app from '@core/instance';

class Page extends React.Component {

  constructor(options) {
    super(options);
    this.state = {
      quiz: null,
      session: null,
      form: null
    };

    this.sync = this.sync.bind(this);
  }

  getFormUrl() {
    return `form/view/${this.props.params.token}`;
  }

  getSessionUrl(form) {
    return `session/view/${form.session_token}`;
  }

  getQuizUrl(session) {
    return `quiz/extended/${session.quiz_token}`;
  }

  sync() {
    return app.api.get(this.getFormUrl()).then(form => {
      return app.api.get(this.getSessionUrl(form)).then(session => {
        return app.api.get(this.getQuizUrl(session)).then(quiz => {
          let route;
          if (session.finished) { // if quiz finished
            route = `/classroom/report/${form.token}`;
          } else if (session.active) { // if quiz is active
            let answers = form.answers.map(a => a.question_id);
            if (answers.length >= quiz.questions.length) {
              this.context.router.push(`/classroom/results/${form.token}`);
            } else {
              route = `/classroom/do/${form.token}`;
            }
          } else { // if quiz isn't active
            route = `/classroom/lowstart/${form.token}`;
          }

          let redirect = window.location.pathname !== route ? route : false;
          if (redirect) {
            this.context.router.replace(redirect)
          } else {
            this.setState({quiz, session, form});
          }
        });
      });
    });
  }

  componentDidMount() {
    this.sync();
    this.delegateListening();
  }

  shouldComponentUpdate(nextProps, nextState) {
    let isTokenChanged = nextProps.token !== this.props.token;
    let isFormChanged = nextState.form && (!this.state.form || nextState.form.token !== this.state.form.token);
    let isSessionChanged = nextState.session && (!this.state.session || nextState.session.token !== this.state.session.token);
    let isQuizChanged = nextState.quiz && (!this.state.quiz || nextState.quiz.token !== this.state.quiz.token);
    return isTokenChanged || isFormChanged || isSessionChanged || isQuizChanged;
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    this.undelegateListening();
  }

  delegateListening() {
    this.interval = setInterval(this.sync, app.settings.interval);
  }

  undelegateListening() {
    clearInterval(this.interval);
  }

  render() {
    return this.state.form
      ? this.renderContent() : null;
  }

  renderContent() {
    throw new Error('You have to override `renderContent` method.');
  }
}

Page.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Page;
