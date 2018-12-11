export default class extends React.Component {

  constructor(options) {
    super(options);
    this.state = {
      id: null,
      className: null,
      viewBox: null,
      style: null
    };
  }

  render() {
    let icon = {__html: '<use xlink:href="#' + this.props.id + '"></use>'};
    return (<svg className={this.props.className} viewBox={this.props.viewBox} dangerouslySetInnerHTML={icon} style={this.props.style}/>);
  }
}
