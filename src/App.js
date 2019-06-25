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
import foursquareAPI from './services/foursquare-api';

const drawerWidth = 280;

const styles = theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: 'none'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  close: {
    padding: theme.spacing(0.5)
  }
});

const locais = [
  '52bd77f5498e6ccda037ae57',
  '537134c0498e2e14ba6260cd',
  '4ba54394f964a5206bf338e3',
  '53e4c456498e457cc2b1316e',
  '536e8826498e9efb781871e8'
];

class App extends Component {
  state = {
    openDrawer: false,
    marcadores: [],
    marcadorSelecionado: null
  };

  componentDidMount() {
    this.getInfoFoursquare();
  }

  handleDrawerOpen = () => this.setState({ openDrawer: true });

  handleDrawerClose = () => this.setState({ openDrawer: false });

  getInfoFoursquare = () => {
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
          if (error.status === 429) {
            console.error(
              'Número permitido de requisições a API do Foursquare foi execido. Tente novamente outro dia.'
            );
          } else {
            console.error('Não foi possível carregar os marcadores.');
          }
        });
    });

    setTimeout(
      () =>
        this.setState({
          marcadores: marcadoresAux,
          marcadorSelecionado: null
        }),
      5000
    );
  };

  handleSelecionarMarcador = marcador =>
    this.setState({ marcadorSelecionado: marcador });

  handleFecharInfoWindow = () => {
    this.setState({ marcadorSelecionado: null });
  };

  render() {
    const { classes } = this.props;
    const { marcadores, marcadorSelecionado } = this.state;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: this.state.openDrawer
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              edge="start"
              className={clsx(
                classes.menuButton,
                this.state.openDrawer && classes.hide
              )}
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
          open={this.state.openDrawer}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          Locais...
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: this.state.openDrawer
          })}
        >
          <div className={classes.drawerHeader} />
          <Mapa
            marcadores={marcadores}
            marcadorSelecionado={marcadorSelecionado}
            selecionarMarcador={this.handleSelecionarMarcador}
            fecharInfoWindow={this.handleFecharInfoWindow}
          />
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(App);
