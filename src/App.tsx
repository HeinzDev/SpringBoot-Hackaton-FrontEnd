import './App.css';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <div className="header"></div>
      <div className="main">
        <div className="sidebar">
          <Link to="/">
            <button className="main-button">UF</button>
          </Link>
          <Link to="/Municipios">
            <button className="main-button">MN</button>
          </Link>
          <Link to="/bairros">
            <button className="main-button">BS</button>
          </Link>
          <Link to="/pessoas">
            <button className="main-button">PS</button>
          </Link>
        </div>

        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
