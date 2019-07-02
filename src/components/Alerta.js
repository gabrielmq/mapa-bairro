import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';

const Alerta = ({ exibir, mensagem, close, exited }) => (
  <>
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      open={exibir}
      autoHideDuration={5000}
      onClose={close}
      onExited={exited}
      ContentProps={{
        'aria-describedby': 'message-id'
      }}
      message={<span id="message-id">{mensagem}</span>}
    />
  </>
);

export default Alerta;
