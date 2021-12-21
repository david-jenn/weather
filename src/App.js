
import './App.scss';

import Navbar from './components/Navbar';
import Weather from './components/Weather';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App d-flex flex-column">
      <Navbar />
      <main className="container flex-grow-1 min-vh-100">
      <Weather />
      </main>
      <Footer />
    </div>
  );
}

export default App;
