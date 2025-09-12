import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Real Estate App</h1>
        <p>A simple, clean real estate application</p>
        <div className="features">
          <div className="feature-card">
            <h3>🏠 Property Search</h3>
            <p>Find your dream home</p>
          </div>
          <div className="feature-card">
            <h3>💰 ROI Calculator</h3>
            <p>Calculate investment returns</p>
          </div>
          <div className="feature-card">
            <h3>🎨 Design Tools</h3>
            <p>Visualize your space</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;