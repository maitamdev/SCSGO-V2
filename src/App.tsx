
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Team from './components/Team';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <Features />
      <Team />
      <Footer />
    </div>
  );
}

export default App;
