import Theater from '@components/base/theater'
import Page from '@components/base/scene'

export default class extends React.Component {

  render() {
    return <Theater>
      <Page type="error"></Page>
    </Theater>;
  }
}
