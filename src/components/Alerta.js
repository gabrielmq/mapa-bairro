import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  close: {
    padding: theme.spacing(0.5)
  }
});
class Alerta extends Component {
  render() {
    const { exibir, carregando, mensagem, classes } = this.props;

    return (
      <>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={exibir || carregando}
          autoHideDuration={6000}
          onClose={this.props.close}
          onExited={this.props.exited}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{mensagem}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </>
    );
  }
}
export default withStyles(styles)(Alerta);
