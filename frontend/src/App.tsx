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

  // Auto initialize auth on component mount
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

  const handleStartGame = () => {
    if (!isLoggedIn && !isAnonymous) {
      startAsGuest();
    }
  };

  return (
    <div className="container">
      {/* HEADER */}
      <header className="header">
        <div className="logo-container">
          <span className="logo-icon">🃏</span>
          <span className="logo-text">DECK RAIDERS</span>
        </div>

        {/* AUTH SECTION / PANEL TOP-RIGHT */}
        <div className="auth-panel-wrapper">
          <button 
            className={`auth-toggle-btn ${isLoggedIn ? 'connected' : isAnonymous ? 'guest' : ''}`}
            onClick={() => setPanelOpen(!panelOpen)}
          >
            {isLoggedIn ? (
              <>
                <span className="user-icon">👤</span>
                <span className="user-name">{user?.email.split('@')[0]}</span>
              </>
            ) : isAnonymous ? (
              <>
                <span className="user-icon">👤</span>
                <span className="user-name">Convidado</span>
              </>
            ) : (
              <>
                <span className="user-icon">🔑</span>
                <span>Conectar</span>
              </>
            )}
          </button>

          {panelOpen && (
            <div className="auth-dropdown card-face">
              <div className="dropdown-header">
                <h3>{isLoggedIn ? 'Perfil do Jogador' : authMode === 'login' ? 'Iniciar Sessão' : 'Recrutar Herói'}</h3>
                <button className="close-btn" onClick={() => { setPanelOpen(false); clearError(); setMessage(''); }}>×</button>
              </div>

              {isLoggedIn ? (
                <div className="dropdown-body logged-in-info">
                  <p><strong>Status:</strong> Campeão da Masmorra</p>
                  <p><strong>E-mail:</strong> {user?.email}</p>
                  <p className="hint">Seu progresso será salvo automaticamente na nuvem.</p>
                  <button className="btn-primary w-full" onClick={() => { logout(); setPanelOpen(false); }}>
                    Desconectar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="dropdown-body auth-form">
                  {(error || message) && (
                    <div className="error-message">
                      {error || message}
                    </div>
                  )}

                  <div className="input-group">
                    <label>E-mail</label>
                    <input 
                      type="email" 
                      placeholder="seu.email@masmorra.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Senha</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? 'Processando...' : authMode === 'login' ? 'Entrar na Masmorra' : 'Registrar Herói'}
                  </button>

                  <div className="auth-mode-switch">
                    {authMode === 'login' ? (
                      <p>Novo por aqui? <span onClick={() => { setAuthMode('register'); clearError(); setMessage(''); }}>Criar Conta</span></p>
                    ) : (
                      <p>Já possui cadastro? <span onClick={() => { setAuthMode('login'); clearError(); setMessage(''); }}>Entrar</span></p>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </header>

      {/* MAIN GAME MENU OR ACTIVE LOBBY */}
      <main className="main-content">
        {!(isLoggedIn || isAnonymous) ? (
          /* TELA DO MENU INICIAL (VISITANTE) */
          <div className="menu-container fade-in">
            <h1 className="hero-title">DECK RAIDERS</h1>
            <p className="hero-subtitle">
              Um Roguelite Deckbuilder Auto-Battler com alma retro e validação server-side.
            </p>

            <div className="start-zone">
              <button className="btn-start" onClick={handleStartGame}>
                INICIAR JOGO
              </button>
              <p className="start-hint">Você jogará temporariamente como <strong>Convidado</strong> sem salvar progresso.</p>
            </div>

            <div className="lore-panel card-face">
              <h3>Crônicas da Masmorra</h3>
              <p>
                Os Raiders descem à masmorra equipando cartas de armas, magias e runas. 
                Os duelos são autônomos e guiados por sementes aleatórias. Monte sua estratégia, 
                valide suas jogadas no santuário e mostre que seu deck é o mais forte.
              </p>
            </div>
          </div>
        ) : (
          /* TELA DE LOBBY / JOGO INICIADO */
          <div className="lobby-container fade-in">
            <h2 className="lobby-title">MASMORRA ADENTRADA</h2>
            <div className="lobby-card card-face">
              <div className="lobby-header">
                <h3>Partida Iniciada</h3>
                <span className="lobby-status">Pronto para Batalha</span>
              </div>
              <div className="lobby-body">
                <p><strong>Herói:</strong> {user?.username}</p>
                <p><strong>Tipo de Sessão:</strong> {isLoggedIn ? 'Autenticado (Salva na Nuvem)' : 'Convidado (Temporário)'}</p>
                
                {isAnonymous && (
                  <div className="warning-banner">
                    ⚠️ <strong>Atenção:</strong> Você está jogando como convidado. Seu progresso será perdido se atualizar a página. 
                    <span className="link-text" onClick={() => { setAuthMode('register'); setPanelOpen(true); }}> Criar conta agora</span> para salvar.
                  </div>
                )}
                
                <div className="placeholder-battlefield">
                  ⚔️ [Área do Auto-Combate em breve] ⚔️
                </div>
              </div>
              <div className="lobby-actions">
                <button className="btn-secondary" onClick={() => logout()}>
                  Retornar ao Menu Principal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Deck Raiders. Inspirado nos clássicos Wizardry e Might & Magic.</p>
      </footer>
    </div>
  );
}

export default App;
