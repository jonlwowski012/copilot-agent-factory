import { WorkflowProvider } from './context/WorkflowContext';
import { FeatureList } from './components/FeatureList';
import { FeatureDetail } from './components/FeatureDetail';
import './App.css';

function App() {
  return (
    <WorkflowProvider>
      <div className="app">
        <header className="app-header">
          <div className="logo">
            <span className="logo-icon">🤖</span>
            <h1>Agentic Workflow Tracker</h1>
          </div>
          <p className="tagline">Track features through the 6-phase development workflow</p>
        </header>
        <main className="app-main">
          <aside className="sidebar">
            <FeatureList />
          </aside>
          <section className="content">
            <FeatureDetail />
          </section>
        </main>
      </div>
    </WorkflowProvider>
  );
}

export default App;
