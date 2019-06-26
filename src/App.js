import React, { Component } from 'react';

import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import './App.css';
import Mapa from './components/Mapa';
import Alerta from './components/Alerta';
import ListaDeLocais from './components/ListaDeLocais';

import foursquareAPI from './services/foursquare-api';
import styles from './app-styles';

const locais = [
  '52bd77f5498e6ccda037ae57',
  '537134c0498e2e14ba6260cd',
  '4ba54394f964a5206bf338e3',
  '53e4c456498e457cc2b1316e',
  '536e8826498e9efb781871e8'
];

class App extends Component {
  state = {
    openDrawer: window.innerWidth >= 980 ? true : false,
    marcadores: [],
    marcadorSelecionado: null,
    openSnackbar: false,
    msgSnackbar: ''
  };

  componentDidMount() {
    this.getInfoFoursquare();
  }

  handleDrawerOpen = () => this.setState({ openDrawer: true });

  handleDrawerClose = () => this.setState({ openDrawer: false });

  getInfoFoursquare = () => {
    this.setState({
      openSnackbar: true,
      msgSnackbar: 'Carregando marcadores...'
    });
    const marcadoresAux = [];
    locais.forEach(local => {
      foursquareAPI
        .get(
          `/venues/${local}?client_id=${
            process.env.REACT_APP_FOURSQUARE_CLID
          }&client_secret=${process.env.REACT_APP_FOURSQUARE_CLSEC}&v=20190621`
        )
        .then(res => {
          marcadoresAux.push(res.data['response']['venue']);
        })
        .catch(error => {
          let msg;
          if (error.response.status === 429) {
            msg =
              'Não foi possível obter informações do Foursquare. Tente mais tarde';
            console.error(msg);
          } else {
            msg = 'Não foi possível carregar os marcadores.';
            console.error(msg);
          }
          this.setState({
            openSnackbar: true,
            msgSnackbar: msg
          });
        })
        .finally(() =>
          setTimeout(
            () =>
              this.setState({
                marcadores: marcadoresAux,
                marcadorSelecionado: null,
                openSnackbar: false,
                msgSnackbar: ''
              }),
            6000
          )
        );
    });
  };

  handleSelecionarMarcador = marcador =>
    this.setState({ marcadorSelecionado: marcador });

  handleFecharInfoWindow = () => {
    this.setState({ marcadorSelecionado: null });
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    console.log(reason);
    this.setState({ openSnackbar: false });
  };

  handleExited = () => this.setState({ openSnackbar: false });

  render() {
    const { classes } = this.props;

    const {
      openDrawer,
      marcadores,
      marcadorSelecionado,
      openSnackbar,
      msgSnackbar
    } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: openDrawer
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, openDrawer && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Mapa do Bairro
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={openDrawer}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <ListaDeLocais
            marcadores={marcadores}
            selecionarMarcador={this.handleSelecionarMarcador}
          />
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: openDrawer
          })}
        >
          <div className={classes.drawerHeader} />
          <Mapa
            marcadores={marcadores}
            marcadorSelecionado={marcadorSelecionado}
            selecionarMarcador={this.handleSelecionarMarcador}
            fecharInfoWindow={this.handleFecharInfoWindow}
          />

          <Alerta
            exibir={openSnackbar}
            close={this.handleClose}
            exited={this.handleExited}
            mensagem={msgSnackbar}
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(App);
