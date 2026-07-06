import { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState<'gameplay' | 'features' | 'tech'>('gameplay');
  const [cardFlipped, setCardFlipped] = useState(false);

  return (
    <div className="container">
      <header className="header">
        <div className="logo-container">
          <span className="logo-icon">🃏</span>
          <span className="logo-text">DECK RAIDERS</span>
        </div>
        <div className="status-badge">
          <span className="pulse-dot"></span> Pre-Alpha v0.0.1
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <h1 className="hero-title">DECK RAIDERS</h1>
          <p className="hero-subtitle">
            O futuro do Roguelite Deckbuilder Auto-Battler Multiplayer Assíncrono.
          </p>
          <div className="cta-container">
            <button className="btn-primary" onClick={() => window.open('https://github.com/betoshimabs/deckraiders', '_blank')}>
              Ver Código no GitHub
            </button>
            <button className="btn-secondary" onClick={() => setCardFlipped(!cardFlipped)}>
              {cardFlipped ? "Revelar Carta" : "Ver Verso da Carta"}
            </button>
          </div>
        </section>

        <section className="interactive-showcase">
          <div className="card-container">
            <div className={`game-card ${cardFlipped ? 'flipped' : ''}`}>
              <div className="card-face card-front">
                <div className="card-header">
                  <span className="card-mana">3</span>
                  <span className="card-title">Ladino Sombrio</span>
                </div>
                <div className="card-art">👤</div>
                <div className="card-body">
                  <p><strong>Grito de Guerra:</strong> Causa 2 de dano físico. Adiciona +1 de Veneno ao alvo.</p>
                </div>
                <div className="card-footer">
                  <span>⚔️ 3</span>
                  <span>🛡️ 2</span>
                </div>
              </div>
              <div className="card-face card-back">
                <div className="card-back-pattern">
                  <span>DR</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tabs-section">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === 'gameplay' ? 'active' : ''}`}
              onClick={() => setActiveTab('gameplay')}
            >
              Gameplay
            </button>
            <button
              className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              Recursos
            </button>
            <button
              className={`tab-btn ${activeTab === 'tech' ? 'active' : ''}`}
              onClick={() => setActiveTab('tech')}
            >
              Stack Técnica
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'gameplay' && (
              <div className="content-pane fade-in">
                <h3>Como Funciona o Jogo?</h3>
                <p>
                  Escolha o seu herói, monte seu deck inicial e explore um mapa procedural.
                  Cada nó do mapa traz combates de auto-battle determinísticos, lojas misteriosas e eventos surpreendentes.
                  Compre itens, refine seu deck e derrote os chefes da masmorra para chegar ao topo!
                </p>
              </div>
            )}
            {activeTab === 'features' && (
              <div className="content-pane fade-in">
                <h3>Recursos Planejados</h3>
                <ul className="features-list">
                  <li>✨ <strong>Multiplayer Assíncrono:</strong> Enfrente clones do deck de outros jogadores em combates simulados.</li>
                  <li>🎲 <strong>Progressão Roguelite:</strong> Caminhos e recompensas geradas proceduralmente a cada run.</li>
                  <li>⚔️ <strong>Auto-Battle Tático:</strong> O posicionamento das suas cartas e a ordem das habilidades decidem a vitória.</li>
                  <li>🖥️ <strong>Suporte Multiplataforma:</strong> Começa no navegador, portável para Steam (Desktop) via Tauri.</li>
                </ul>
              </div>
            )}
            {activeTab === 'tech' && (
              <div className="content-pane fade-in">
                <h3>Nossa Arquitetura de Desenvolvimento</h3>
                <div className="tech-grid">
                  <div className="tech-item">
                    <span className="tech-icon">⚛️</span>
                    <strong>React + TS</strong>
                    <span>Interface rápida e componentes interativos.</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-icon">⚡</span>
                    <strong>Vite</strong>
                    <span>Build de desenvolvimento instantânea.</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-icon">🗄️</span>
                    <strong>PocketBase</strong>
                    <span>Backend leve e seguro para autenticação e dados.</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-icon">🦀</span>
                    <strong>Tauri</strong>
                    <span>Portabilidade otimizada para o cliente Steam.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Deck Raiders. Desenvolvido com carinho para a web e além.</p>
      </footer>
    </div>
  )
}

export default App
