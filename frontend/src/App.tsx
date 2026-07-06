import { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
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
    <div className="tabletop-table">
      <div className="tabletop-wrapper">
        
        {/* TOP BANNER HUD */}
        <header className="hud-banner">
          <div className="hud-left">
            <span className="hud-badge-gold">✦ PORTAL DA MASMORRA ✦</span>
          </div>

          <div className="auth-panel-wrapper">
            <button 
              className={`hud-btn-parchment ${isLoggedIn ? 'active-user' : isAnonymous ? 'active-guest' : ''}`}
              onClick={() => setPanelOpen(!panelOpen)}
            >
              {isLoggedIn ? `👤 ${user?.email.split('@')[0].toUpperCase()}` : isAnonymous ? '👤 CONVIDADO' : '🔑 CONECTAR'}
            </button>

            {panelOpen && (
              <div className="parchment-modal">
                <div className="modal-header">
                  <h4>{isLoggedIn ? 'PERFIL DO HERÓI' : authMode === 'login' ? 'LOGIN' : 'RECRUTAMENTO'}</h4>
                  <button className="modal-close" onClick={() => { setPanelOpen(false); clearError(); setMessage(''); }}>×</button>
                </div>

                {isLoggedIn ? (
                  <div className="modal-body">
                    <p>STATUS: CAMPEÃO DA MESA</p>
                    <p>E-MAIL: {user?.email}</p>
                    <button className="btn-retro-red w-full" onClick={() => { logout(); setPanelOpen(false); }}>
                      DESCONECTAR
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAuthSubmit} className="modal-body">
                    {(error || message) && <div className="error-scroll">{error || message}</div>}

                    <div className="parchment-input-group">
                      <label>ENDEREÇO DE E-MAIL</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="heroi@masmorra.com"
                      />
                    </div>

                    <div className="parchment-input-group">
                      <label>SENHA DE ACESSO</label>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                      />
                    </div>

                    <button type="submit" className="btn-retro-gold w-full" disabled={loading}>
                      {loading ? 'CARREGANDO...' : authMode === 'login' ? 'ENTRAR' : 'REGISTRAR'}
                    </button>

                    <div className="modal-switch">
                      {authMode === 'login' ? (
                        <p>NOVO HERÓI? <span onClick={() => { setAuthMode('register'); clearError(); setMessage(''); }}>CADASTRAR</span></p>
                      ) : (
                        <p>JÁ POSSUI FICHA? <span onClick={() => { setAuthMode('login'); clearError(); setMessage(''); }}>ENTRAR</span></p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </header>

        {/* MAIN PLAYING BOARD */}
        <main className="playing-board">
          {!(isLoggedIn || isAnonymous) ? (
            /* TELA INICIAL (MENU MESA) */
            <div className="menu-scroll fade-in">
              <div className="fantasy-logo">
                <span className="fantasy-tag">ROGuelite de cartas e tabuleiro</span>
                <h1 className="title-fantasy">DECK RAIDERS</h1>
              </div>

              <div className="menu-action-zone">
                <button className="btn-wax-seal" onClick={startAsGuest}>
                  INICIAR JOGO
                </button>
                <div className="tabletop-caption">
                  MODO CONVIDADO • EXPERIÊNCIA DE DEMONSTRAÇÃO
                </div>
              </div>
            </div>
          ) : (
            /* LOBBY / TABULEIRO ATIVO */
            <div className="board-gameplay fade-in">
              <div className="board-hud-header">
                <h2>O CORREDOR DA MASMORRA</h2>
                <div className="board-player-info">
                  JOGADOR: {user?.username} ({isLoggedIn ? 'NUVEM' : 'LOCAL'})
                </div>
              </div>

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

              <div className="board-actions">
                <button className="btn-retro-red" onClick={() => logout()}>
                  ABANDONAR PARTIDA
                </button>
              </div>
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="hud-footer">
          <div className="footer-left">DECK RAIDERS PROTÓTIPO V0.0.1</div>
          <div className="footer-right">✦ INSPIRAÇÃO: WIZARDRY & MIGHT AND MAGIC ✦</div>
        </footer>
      </div>
    </div>
  );
}

export default App;
