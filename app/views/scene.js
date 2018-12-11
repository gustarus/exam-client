export default class extends React.Component {

  render() {
    let className = 'scene'
      + (this.props.middle ? ' scene_middle' : '')
      + (this.props.center ? ' scene_center' : '')
      + (this.props.className ? ' ' + this.props.className : '');
    return <div className={className}>{this.props.children}</div>;
  }
}
