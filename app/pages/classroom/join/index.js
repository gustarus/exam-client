import serialize from 'form-serialize';
import Theater from '@core/views/theater';
import Scene from '@core/views/scene';
import Card from '@core/views/card';
import app from '@core/instance';

import style from '@core/pages/whiteboard/session/style.styl';

class Page extends React.Component {

  constructor(options) {
    super(options);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    return (
      <Theater>
        <Scene middle={true}>
          <Card className={style.container}>
            <form onSubmit={this.onSubmit} autoComplete="off">
              <div className={style.block}>
                <h4 className={style.header}>Пожалуйста, представьтесь</h4>
                <input type="text" name="value" placeholder="Введите в это поле" className={style.input}/>
              </div>
              <div className={style.buttons}>
                <input type="submit" className={style.button} value="Начать"/>
              </div>
            </form>
          </Card>
        </Scene>
      </Theater>
    );
  }

  onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.processing) {
      this.processing = true;
      let data = serialize(e.target, {hash: true});
      if (data.value) {
        app.api.post('form/create', {session_token: this.props.params.session_token, identity: data.value}).then(form => {
          this.processing = false;
          this.context.router.replace(`/classroom/lowstart/${form.token}`);
        });
      }
    }
  }
}

Page.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Page;
