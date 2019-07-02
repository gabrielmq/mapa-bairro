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

import escapeRegExp from 'escape-string-regexp';

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
    msgSnackbar: '',
    filtro: ''
  };

  componentDidMount() {
    let mapsError = false;
    window.gm_authFailure = () => {
      mapsError = true;
      alert('Não foi possível carregar o Google Maps.');
    };

    setTimeout(
      () => this.getInfoFoursquare(mapsError),
      mapsError ? 5000 : 1500
    );
  }

  handleDrawerOpen = () => this.setState({ openDrawer: true });

  handleDrawerClose = () => this.setState({ openDrawer: false });

  /**
   * Realiza a busca das informações dos locais no Foursquare
   */
  getInfoFoursquare = mapsError => {
    if (mapsError) {
      this.setState({
        openSnackbar: true,
        msgSnackbar: 'Não foi possível carregar os marcadores.'
      });
      return;
    }

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
          this.setState({
            openSnackbar: true,
            msgSnackbar: 'Não foi possível carregar as informações no Mapa.'
          });
        })
        .finally(() => {
          setTimeout(
            () =>
              this.setState({
                marcadores: marcadoresAux,
                marcadorSelecionado: null,
                openSnackbar: false,
                msgSnackbar: ''
              }),
            3500
          );
        });
    });
  };

  /** Marca no mapa o local selecionado */
  handleSelecionarMarcador = marcador => {
    this.setState({ marcadorSelecionado: marcador });
  };

  /** Fecha a janela com as informações do local */
  handleFecharInfoWindow = () => this.setState({ marcadorSelecionado: null });

  /** Trata o fechamento da Snackbar */
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ openSnackbar: false });
  };

  /** Trata o fechamento automatico da Snackbar */
  handleExited = () => this.setState({ openSnackbar: false });

  handleFiltroChange = e => this.setState({ filtro: e.target.value });

  getMarcadoresFiltrados = marcadores => {
    const { filtro } = this.state;
    if (!filtro) return marcadores;

    const regex = new RegExp(escapeRegExp(filtro), 'i');
    return marcadores.filter(marcador => regex.test(marcador.name));
  };

  render() {
    const { classes } = this.props;

    const {
      openDrawer,
      marcadores,
      marcadorSelecionado,
      openSnackbar,
      msgSnackbar
    } = this.state;

    const locaisMarcados = this.getMarcadoresFiltrados(marcadores);

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
            marcadores={locaisMarcados}
            selecionarMarcador={this.handleSelecionarMarcador}
            atualizarFiltro={this.handleFiltroChange}
          />
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: openDrawer
          })}
        >
          <div className={classes.drawerHeader} />
          <Mapa
            marcadores={locaisMarcados}
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
