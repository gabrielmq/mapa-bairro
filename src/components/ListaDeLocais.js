import React from 'react';

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

const ListaDeLocais = ({
  classes,
  marcadores,
  filtro,
  atualizarFiltro,
  selecionarMarcador
}) => (
  <>
    <TextField
      id="outlined-name"
      label="Filtrar local"
      className={classes.textField}
      value={filtro}
      onChange={atualizarFiltro}
      margin="normal"
      variant="outlined"
    />

    {marcadores.map((marcador, i) => (
      <div key={i} style={{ padding: '0 10px' }}>
        <List dense>
          <ListItem
            button
            style={{ padding: '0' }}
            onClick={() => selecionarMarcador(marcador)}
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

export default withStyles(styles)(ListaDeLocais);
