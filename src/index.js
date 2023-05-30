import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './App';
import Queries from './components/queries/Queries';
import Context from './context';
import Login from './components/login/Login';
import Ico from './components/ico/ico';
import { useState } from 'react';

const Container = () => {
  const [logged, setLogged] = useState(false);
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState();
  const [result, setResult] = useState(<Login />);
  const [mmLogged, setMmLogged] = useState(false);

  return (
    <Context.Provider
      value={{
        logged,
        setLogged,
        balance,
        setBalance,
        wallet,
        setWallet,
        mmLogged,
        setMmLogged,
        result,
        setResult,
      }}
    >
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={App} />
          <Route path="/queries" component={Queries} />
          <Route path="/ico" component={Ico} />
        </Switch>
      </BrowserRouter>
    </Context.Provider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Container />
  </React.StrictMode>,
  document.getElementById('root')
);
