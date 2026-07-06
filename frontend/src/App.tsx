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
    <div className="crt-screen">
      <div className="scanlines"></div>
      
      <div className="game-container">
        {/* HEADER / HUD TOP BAR */}
        <header className="game-hud-bar">
          <div className="hud-left">
            <span className="hud-badge">SYS: ONLINE</span>
          </div>

          <div className="auth-panel-wrapper">
            <button 
              className={`hud-btn-auth ${isLoggedIn ? 'active-user' : isAnonymous ? 'active-guest' : ''}`}
              onClick={() => setPanelOpen(!panelOpen)}
            >
              {isLoggedIn ? `👤 ${user?.email.split('@')[0]}` : isAnonymous ? '👤 CONVIDADO' : '🔑 CONECTAR'}
            </button>

            {panelOpen && (
              <div className="retro-modal">
                <div className="modal-header">
                  <h4>{isLoggedIn ? 'PERFIL' : authMode === 'login' ? 'ENTRAR' : 'REGISTRAR'}</h4>
                  <button className="modal-close" onClick={() => { setPanelOpen(false); clearError(); setMessage(''); }}>×</button>
                </div>

                {isLoggedIn ? (
                  <div className="modal-body logged-in-info">
                    <p>STATUS: CAMPEÃO</p>
                    <p>EMAIL: {user?.email}</p>
                    <button className="btn-primary w-full" onClick={() => { logout(); setPanelOpen(false); }}>
                      SAIR DA SESSÃO
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAuthSubmit} className="modal-body">
                    {(error || message) && <div className="error-box">{error || message}</div>}

                    <div className="retro-input-group">
                      <label>EMAIL</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nome@masmorra.com"
                      />
                    </div>

                    <div className="retro-input-group">
                      <label>SENHA</label>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="******"
                      />
                    </div>

                    <button type="submit" className="btn-primary w-full" disabled={loading}>
                      {loading ? 'CARREGANDO...' : authMode === 'login' ? 'ENTRAR' : 'REGISTRAR'}
                    </button>

                    <div className="modal-switch">
                      {authMode === 'login' ? (
                        <p>NÃO POSSUI CONTA? <span onClick={() => { setAuthMode('register'); clearError(); setMessage(''); }}>CADASTRAR</span></p>
                      ) : (
                        <p>JÁ CADASTRADO? <span onClick={() => { setAuthMode('login'); clearError(); setMessage(''); }}>ENTRAR</span></p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </header>

        {/* MAIN DISPLAY AREA */}
        <main className="game-display">
          {!(isLoggedIn || isAnonymous) ? (
            /* MENU PRINCIPAL (LIMPO) */
            <div className="main-menu fade-in">
              <div className="title-logo">
                <span className="subtitle-tag">AN ASYNCHRONOUS AUTO-BATTLER</span>
                <h1 className="title-text">DECK RAIDERS</h1>
              </div>

              <div className="menu-choices">
                <button className="btn-start-game" onClick={startAsGuest}>
                  INICIAR JOGO
                </button>
                <div className="guest-warning-text">
                  MODO DEMONSTRAÇÃO ATIVO COMO CONVIDADO
                </div>
              </div>
            </div>
          ) : (
            /* LOBBY / JOGO INICIADO */
            <div className="game-lobby fade-in">
              <div className="lobby-hud">
                <h2>MASMORRA - NÍVEL 1</h2>
                <div className="player-indicator">
                  JOGADOR: {user?.username} ({isLoggedIn ? 'SALVO' : 'CONVIDADO'})
                </div>
              </div>

              <div className="tactical-board">
                <div className="board-grid">
                  <div className="board-slot empty-slot">SLOT_01</div>
                  <div className="board-slot empty-slot">SLOT_02</div>
                  <div className="board-slot empty-slot">SLOT_03</div>
                  <div className="board-slot empty-slot">SLOT_04</div>
                </div>
                <div className="board-center-msg">
                  AGUARDANDO SELEÇÃO DE CARTAS
                </div>
              </div>

              {isAnonymous && (
                <div className="guest-save-banner">
                  ⚠️ SEU PROGRESSO NÃO SERÁ SALVO. <span className="save-link" onClick={() => { setAuthMode('register'); setPanelOpen(true); }}>CLIQUE AQUI PARA SE CADASTRAR</span>
                </div>
              )}

              <div className="lobby-footer-actions">
                <button className="btn-retro-secondary" onClick={() => logout()}>
                  ABANDONAR RUN
                </button>
              </div>
            </div>
          )}
        </main>

        {/* BOTTOM HUD / FOOTER */}
        <footer className="game-hud-footer">
          <div className="footer-left">DECK_RAIDERS_PROT_V0.0.1</div>
          <div className="footer-right">© 2026 INSP: WIZARDRY & MIGHT-N-MAGIC</div>
        </footer>
      </div>
    </div>
  );
}

export default App;
