import React, { Component } from 'react';

import Snackbar from '@material-ui/core/Snackbar';

export default class Alerta extends Component {
  render() {
    const { exibir, mensagem } = this.props;

    return (
      <>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={exibir}
          autoHideDuration={6000}
          onClose={this.props.close}
          onExited={this.props.exited}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{mensagem}</span>}
        />
      </>
    );
  }
}
