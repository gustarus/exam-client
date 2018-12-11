import Theater from '@core/views/theater';
import Scene from '@core/views/scene';
import Card from '@core/views/card';
import app from '@core/instance';
import style from '@core/pages/whiteboard/session/style.styl';

class Page extends React.Component {

  constructor(options) {
    super(options);
    this.state = {session: null};
    this.sync = this.sync.bind(this);
    this.onPauseClick = this.onPauseClick.bind(this);
  }

  componentDidMount() {
    this.sync();
    this.delegateListening();
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

  sync() {
    app.api.get(`session/view/${this.props.params.token}`).then(session => {
      app.api.get(`quiz/extended/${session.quiz_token}`).then(quiz => {
        if (session.finished) {
          this.context.router.push(`/whiteboard/results/${session.token}`);
        } else if (!session.active) {
          this.context.router.push(`/whiteboard/session/${session.token}`);
        } else {
          this.setState({quiz, session});
        }
      });
    });
  }

  render() {
    if (!this.state.session) {
      return null;
    }

    let duration = moment.duration(this.state.session.duration, 'seconds');
    let hours = duration.hours() || 0;
    let minutes = duration.minutes() || 0;

    // get only filled with more than one answers forms
    let nonEmptyForms = this.state.session.forms.filter(a => a.answers.length);

    // render histogram columns
    let columns = nonEmptyForms.map((form, i) => {
      let width = 100 / nonEmptyForms.length;
      let height = 100 / this.state.quiz.questions.length * form.answers.length;
      let color = `hsl(${(this.props.colorRange[1] - this.props.colorRange[0]) / 100 * height}, 65%, 61%)`;

      let css = {
        width: `${width}%`,
        height: `${height}%`,
        backgroundColor: color
      };

      return <div key={i} className={style.histogram__column} style={css}/>
    });

    return (
      <Theater>
        <Scene middle={true}>
          <Card className={style.container}>
            <div className={style.block}>
              <h4 className={style.header}>Скопируйте этот адрес и разошлите классу</h4>
              <input className={style.url} value={window.location.origin + '/classroom/join/'+ this.state.session.token} readOnly={true}/>
            </div>

            <div className={style.block}>
              <div className={style.block__column}>
                <h4 className={style.header}>Статистика в реальном времени</h4>

                <div className={style.histogram}>
                  <div className={style.histogram__vertical}>
                    <span>0</span>
                    <span>{this.state.quiz.questions.length}</span>
                    Дано ответов
                  </div>
                  <div className={style.histogram__horizontal}>
                    <span>0</span>
                    <span>{nonEmptyForms.length}</span>
                    Участники
                  </div>
                  <div className={style.histogram__columns}>{columns}</div>
                </div>
              </div>

              <div className={style.block__column}>
                <h4 className={style.header}>Прошло времени</h4>

                <div className={style.counter}>
                  <div className={style.counter__label}>{hours}ч {minutes}м</div>
                </div>
              </div>
            </div>

            <div className={style.buttons}>
              <a href="#" className={style.button} onClick={this.onPauseClick}>На паузу</a>
            </div>
          </Card>
        </Scene>
      </Theater>
    );
  }

  onPauseClick(e) {
    e.preventDefault();
    e.stopPropagation();
    app.api.put(`session/pause/${this.state.session.token}`).then(response => {
      this.context.router.goBack();
    })
  }
}

Page.defaultProps = {
  colorRange: [22, 119]
};

Page.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Page;
