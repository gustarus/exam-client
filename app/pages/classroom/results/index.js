import FormPage from '@core/views/pages/form';
import Theater from '@core/views/theater';
import Scene from '@core/views/scene';
import Card from '@core/views/card';
import app from '@core/instance';

import style from '@core/pages/whiteboard/session/style.styl';

export default class extends FormPage {

  renderContent() {
    return (
      <Theater>
        <Scene middle={true}>
          <Card className={style.container}>
            <div className={style.block}>
              <h4 className={style.header}>Ваш результат</h4>

              <div className={style.counter}>
                <div className={style.counter__indicator}/>
                <div className={style.counter__label}>{this.state.form.score} из {this.state.form.weight}</div>
              </div>
            </div>
          </Card>
        </Scene>
      </Theater>
    );
  }
}
