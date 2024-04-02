import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css" rel="stylesheet"></link>
      </header>
    </div>
  );
}

export default App;
