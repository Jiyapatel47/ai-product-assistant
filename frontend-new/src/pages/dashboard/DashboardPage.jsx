
import { useAuth } from "../../context/AuthContext";

function DashboardPage({ onOpenWorkspace, onLogout }) {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}
      <header className="dashboard-header">

        <div className="brand-section">
          <div className="brand-icon">✦</div>

          <div>
            <h1>AI Product Assistant</h1>
            <p>Customer Feedback Intelligence Platform</p>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={onLogout}
        >
          Logout
        </button>

      </header>


      {/* ================= MAIN ================= */}
      <main className="dashboard-content">

        {/* HERO */}
        <section className="dashboard-hero">

          <div className="hero-content">

            <div className="ai-badge">
              ✨ AI-Powered Product Intelligence
            </div>

            <h2>
              Turn Customer Feedback
              <span> Into Better Products.</span>
            </h2>

            <p>
              Analyze customer feedback using AI to discover
              recurring themes, pain points, feature opportunities
              and actionable product insights.
            </p>

            <button
              className="hero-button"
              onClick={onOpenWorkspace}
            >
              Open Product Workspace
              <span>→</span>
            </button>

          </div>


          {/* AI VISUAL */}
          <div className="hero-visual">

            <div className="ai-orb">
              <div className="orb-inner">
                ✦
              </div>
            </div>

            <div className="floating-card card-one">
              <span>💬</span>
              <div>
                <strong>Feedback</strong>
                <small>Customer Voice</small>
              </div>
            </div>

            <div className="floating-card card-two">
              <span>🧠</span>
              <div>
                <strong>AI Analysis</strong>
                <small>Smart Insights</small>
              </div>
            </div>

            <div className="floating-card card-three">
              <span>🚀</span>
              <div>
                <strong>Product Action</strong>
                <small>Build Better</small>
              </div>
            </div>

          </div>

        </section>


        {/* WELCOME */}
        <section className="welcome-strip">

          <div>
            <span className="welcome-label">
              YOUR WORKSPACE
            </span>

            <h3>
              Welcome{user?.name ? `, ${user.name}` : ""}! 👋
            </h3>

            <p>
              Start by uploading customer feedback and let AI
              transform raw feedback into meaningful product decisions.
            </p>
          </div>

          <div className="welcome-status">
            <span className="status-dot"></span>
            AI Engine Ready
          </div>

        </section>


        {/* FEATURES */}
        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <span>WHAT YOU CAN DO</span>
              <h2>From Feedback to Product Decisions</h2>
            </div>
          </div>


          <div className="feature-grid">

            <div className="feature-card featured-card">

              <div className="feature-icon purple">
                📊
              </div>

              <div className="feature-number">
                01
              </div>

              <h3>Feedback Analysis</h3>

              <p>
                Import customer feedback and automatically
                identify patterns, categories and important
                customer problems.
              </p>

              <div className="feature-arrow">
                Analyze feedback →
              </div>

            </div>


            <div className="feature-card">

              <div className="feature-icon blue">
                💡
              </div>

              <div className="feature-number">
                02
              </div>

              <h3>AI Insights</h3>

              <p>
                Discover recurring themes, pain points and
                feature requests hidden inside customer feedback.
              </p>

              <div className="feature-arrow">
                Discover insights →
              </div>

            </div>


            <div className="feature-card">

              <div className="feature-icon green">
                📋
              </div>

              <div className="feature-number">
                03
              </div>

              <h3>PRD Generation</h3>

              <p>
                Convert validated customer insights into
                structured product requirements using AI.
              </p>

              <div className="feature-arrow">
                Generate requirements →
              </div>

            </div>


            <div className="feature-card">

              <div className="feature-icon orange">
                🚀
              </div>

              <div className="feature-number">
                04
              </div>

              <h3>Product Roadmap</h3>

              <p>
                Transform product requirements into an
                actionable roadmap for future development.
              </p>

              <div className="feature-arrow">
                Build roadmap →
              </div>

            </div>

          </div>

        </section>


        {/* WORKFLOW */}
        <section className="workflow-section">

          <div className="workflow-header">
            <span>HOW IT WORKS</span>
            <h2>Customer Voice → Product Strategy</h2>
          </div>


          <div className="workflow">

            <div className="workflow-step">
              <div className="workflow-circle">1</div>
              <h3>Collect</h3>
              <p>Upload customer feedback</p>
            </div>

            <div className="workflow-line"></div>

            <div className="workflow-step">
              <div className="workflow-circle">2</div>
              <h3>Analyze</h3>
              <p>AI identifies patterns</p>
            </div>

            <div className="workflow-line"></div>

            <div className="workflow-step">
              <div className="workflow-circle">3</div>
              <h3>Understand</h3>
              <p>Discover product insights</p>
            </div>

            <div className="workflow-line"></div>

            <div className="workflow-step">
              <div className="workflow-circle">4</div>
              <h3>Act</h3>
              <p>Generate PRD & roadmap</p>
            </div>

          </div>

        </section>


        {/* FINAL CTA */}
        <section className="dashboard-cta">

          <div>
            <span>READY TO START?</span>

            <h2>
              Let AI turn your customer voice
              into your next product decision.
            </h2>
          </div>

          <button onClick={onOpenWorkspace}>
            Start Analyzing →
          </button>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="dashboard-footer">
        <p>
          AI Product Assistant · Customer Feedback Intelligence
        </p>
      </footer>

    </div>
  );
}

export default DashboardPage;

