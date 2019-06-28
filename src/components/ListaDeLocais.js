import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
});

class ListaDeLocais extends Component {
  render() {
    const { classes, marcadores } = this.props;

    return (
      <>
        <TextField
          id="outlined-name"
          label="Filtrar local"
          className={classes.textField}
          value={this.props.filtro}
          onChange={this.props.atualizarFiltro}
          margin="normal"
          variant="outlined"
        />

        {marcadores.map((marcador, i) => (
          <div key={i} style={{ padding: '0 10px' }}>
            <List dense>
              <ListItem
                button
                style={{ padding: '0' }}
                onClick={() => this.props.selecionarMarcador(marcador)}
              >
                <ListItemText
                  primary={marcador.name}
                  secondary={marcador.location.formattedAddress[0]}
                />
              </ListItem>
              <Divider />
            </List>
          </div>
        ))}
      </>
    );
  }
}

export default withStyles(styles)(ListaDeLocais);
