import logoImg from './assets/logo.png';
import './App.css';

function App() {
  return (
    <div className="clean-black-screen">
      <div className="top-left-logo-container">
        <img src={logoImg} alt="DeckRaiders" className="deckraiders-logo" />
      </div>
    </div>
  );
}

export default App;
