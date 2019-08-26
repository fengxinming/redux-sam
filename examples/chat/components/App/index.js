import ThreadSection from '../ThreadSection';
import MessageSection from '../MessageSection';

import React, { PureComponent } from 'react';

class App extends PureComponent {
  render() {
    return (
      <div className="chatapp">
        <ThreadSection />
        <MessageSection />
      </div>
    );
  }
}

export default App;
