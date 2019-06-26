import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import escapeRegExp from 'escape-string-regexp';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
});

class ListaDeLocais extends Component {
  state = {
    filtro: ''
  };

  handleFiltroChange = e => this.setState({ filtro: e.target.value });

  filtrarLista = marcadores => {
    const { filtro } = this.state;
    if (!filtro) return marcadores;

    const regex = new RegExp(escapeRegExp(filtro), 'i');
    return marcadores.filter(marcador => regex.test(marcador.name));
  };

  render() {
    const { classes, marcadores } = this.props;
    const { filtro } = this.state;

    const listaFiltrada = this.filtrarLista(marcadores);

    return (
      <>
        <TextField
          id="outlined-name"
          label="Filtrar local"
          className={classes.textField}
          value={filtro}
          onChange={this.handleFiltroChange}
          margin="normal"
          variant="outlined"
        />

        {listaFiltrada.map((marcador, i) => (
          <div key={i} style={{ padding: '0 10px' }}>
            <List dense>
              <ListItem
                key={marcador.id}
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
