import { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import logoImg from './assets/logo.png';
import './App.css';

function App() {
  const {
    isLoggedIn,
    isAnonymous,
    user,
    error,
    loading,
    login,
    logout,
    register,
    startAsGuest,
    clearError,
    initAuth,
  } = useAuthStore();

  const [panelOpen, setPanelOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    initAuth();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!email || !password) {
      setMessage('Preencha todos os campos.');
      return;
    }

    let success = false;
    if (authMode === 'login') {
      success = await login(email, password);
    } else {
      success = await register(email, password);
    }

    if (success) {
      setPanelOpen(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="clean-black-screen">
      
      {/* SE O JOGO NÃO ESTIVER ATIVO (TELA INICIAL) */}
      {!(isLoggedIn || isAnonymous) ? (
        <>
          {/* LOGO SUPERIOR ESQUERDO */}
          <div className="top-left-logo-container">
            <img src={logoImg} alt="DeckRaiders" className="deckraiders-logo" />
          </div>

          {/* BOTÃO CONECTAR / LOGIN SUPERIOR DIREITO */}
          <div className="top-right-auth-container">
            <button 
              className="btn-retro-parchment"
              onClick={() => setPanelOpen(!panelOpen)}
            >
              🔑 CONECTAR
            </button>

            {panelOpen && (
              <div className="retro-parchment-modal">
                <div className="modal-header">
                  <h4>{authMode === 'login' ? 'INICIAR FICHA' : 'CRIAR HERÓI'}</h4>
                  <button className="modal-close" onClick={() => { setPanelOpen(false); clearError(); setMessage(''); }}>×</button>
                </div>

                <form onSubmit={handleAuthSubmit} className="modal-body">
                  {(error || message) && <div className="error-scroll">{error || message}</div>}

                  <div className="parchment-input-group">
                    <label>E-MAIL</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="heroi@masmorra.com"
                    />
                  </div>

                  <div className="parchment-input-group">
                    <label>SENHA</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                    />
                  </div>

                  <button type="submit" className="btn-retro-red w-full" disabled={loading}>
                    {loading ? 'CARREGANDO...' : authMode === 'login' ? 'ENTRAR' : 'REGISTRAR'}
                  </button>

                  <div className="modal-switch">
                    {authMode === 'login' ? (
                      <p>NOVO AQUI? <span onClick={() => { setAuthMode('register'); clearError(); setMessage(''); }}>CADASTRAR</span></p>
                    ) : (
                      <p>JÁ TEM FICHA? <span onClick={() => { setAuthMode('login'); clearError(); setMessage(''); }}>ENTRAR</span></p>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* BOTÃO INICIAR JOGO ESQUERDO INFERIOR */}
          <div className="bottom-left-action-container">
            <button className="btn-retro-action" onClick={startAsGuest}>
              INICIAR JOGO
            </button>
            <div className="tabletop-caption">
              MODO CONVIDADO • SEM SALVAR PROGRESSO
            </div>
          </div>
        </>
      ) : (
        /* SE O JOGO ESTIVER ATIVO (LOBBY / MASMORRA) */
        <div className="board-gameplay fade-in">
          {/* HEADER DO TABULEIRO */}
          <header className="board-header">
            <div className="board-title-group">
              <img src={logoImg} alt="DeckRaiders" className="board-logo-small" />
              <h2>O CORREDOR DA MASMORRA</h2>
            </div>
            
            <div className="board-session-info">
              <span className="player-badge">👤 {user?.username} ({isLoggedIn ? 'NUVEM' : 'CONVIDADO'})</span>
              <button className="btn-parchment-sm" onClick={() => logout()}>ABANDONAR</button>
            </div>
          </header>

          {/* TABULEIRO FÍSICO */}
          <div className="physical-deck-area">
            <div className="cards-mat">
              <div className="card-slot-outline">SLOT I</div>
              <div className="card-slot-outline">SLOT II</div>
              <div className="card-slot-outline">SLOT III</div>
              <div className="card-slot-outline">SLOT IV</div>
            </div>
            <div className="mat-banner-msg">
              DISPONHA SUAS CARTAS NO TABULEIRO
            </div>
          </div>

          {isAnonymous && (
            <div className="save-banner-parchment">
              ⚠️ SEU PROGRESSO NÃO SERÁ GUARDADO. <span className="parchment-link" onClick={() => { setAuthMode('register'); setPanelOpen(true); }}>REGISTRE SUA FICHA</span> PARA SALVAR AS VITÓRIAS.
            </div>
          )}

          {panelOpen && (
            <div className="parchment-modal-overlay">
              <div className="retro-parchment-modal static-modal">
                <div className="modal-header">
                  <h4>RECRUTAR HERÓI (SALVAR)</h4>
                  <button className="modal-close" onClick={() => { setPanelOpen(false); clearError(); setMessage(''); }}>×</button>
                </div>
                <form onSubmit={handleAuthSubmit} className="modal-body">
                  {(error || message) && <div className="error-scroll">{error || message}</div>}
                  <div className="parchment-input-group">
                    <label>E-MAIL</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="heroi@masmorra.com"
                    />
                  </div>
                  <div className="parchment-input-group">
                    <label>SENHA</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                    />
                  </div>
                  <button type="submit" className="btn-retro-red w-full" disabled={loading}>
                    {loading ? 'SALVANDO...' : 'CADASTRAR E SALVAR'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
}

export default App;
