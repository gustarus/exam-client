import Theater from '@core/views/theater';
import Scene from '@core/views/scene';
import Card from '@core/views/card';
import app from '@core/instance';
import style from './style.styl';

class Page extends React.Component {

  constructor(options) {
    super(options);
    this.state = {session: null};
    this.sync = this.sync.bind(this);
    this.onBeginClick = this.onBeginClick.bind(this);
    this.onFinishClick = this.onFinishClick.bind(this);
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
      if (session.finished) {
        this.context.router.push(`/whiteboard/results/${session.token}`);
      } else if (session.active) {
        this.context.router.push(`/whiteboard/runtime/${session.token}`);
      } else {
        this.setState({session});
      }
    });
  }

  render() {
    if (!this.state.session) {
      return null;
    }

    let clients = this.state.session.forms.length;

    let duration = moment.duration(this.state.session.duration, 'seconds');
    let hours = duration.hours() || 0;
    let minutes = duration.minutes() || 0;

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
                <h4 className={style.header}>Подключилось к тесту</h4>

                <div className={style.counter}>
                  <div className={style.counter__indicator}/>
                  <div className={style.counter__label}>{clients}</div>
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
              <a href="#" className={style.button} onClick={this.onBeginClick}>Начать</a>
              <a href="#" className={style.button} onClick={this.onFinishClick}>Закончить</a>
            </div>
          </Card>
        </Scene>
      </Theater>
    );
  }

  onBeginClick(e) {
    e.preventDefault();
    e.stopPropagation();
    app.api.put(`session/start/${this.state.session.token}`).then(result => {
      this.context.router.push(`/whiteboard/runtime/${this.state.session.token}`);
    });
  }

  onFinishClick(e) {
    e.preventDefault();
    e.stopPropagation();
    app.api.put(`session/finish/${this.state.session.token}`).then(session => {
      this.context.router.push(`/whiteboard/results/${this.state.session.token}`);
    });
  }
}

Page.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Page;
