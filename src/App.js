import './App.css';
import Filearea from './component/Filearea';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <p>Image To Pdf</p>
        </nav>
      </header>
      <Filearea/>
      <footer className='App-footer'>
        <span>© 2023 All Copy Right astech</span>
      </footer>
    </div>
  );
}

export default App;
