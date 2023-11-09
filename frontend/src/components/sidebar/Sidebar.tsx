import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';


const Sidebar: React.FC = () => {
  const { isAdm } = useContext(AuthContext);
  const isAdmin = isAdm === "1";
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 h-screen w-full bg-tdb-gray">
      <ul className="z-50">
        <Link to="/" title="Home">
          <li className={`p-4 font-semibold shadow-sm text-gray-500 ${location.pathname === "/" ? 'bg-tdb-cyan text-tdb-gray' : 'hover:text-gray-400'}`}>
            Home
          </li>
        </Link>
        <Link to="/catalog" title="Catálogo de Brinquedos">
          <li className={`p-4 font-semibold shadow-sm text-gray-500 ${location.pathname === "/catalog" || location.pathname === "/category" ? 'bg-tdb-cyan text-tdb-gray' : 'hover:text-gray-400'}`}>
            Catálogo
          </li>
        </Link>
        {isAdmin && (
          <div>
            <Link to="/admin" title="Admin">
              <li className={`p-4 font-semibold shadow-sm text-gray-500 ${location.pathname === "/admin" ? 'bg-tdb-cyan text-tdb-gray' : 'hover:text-gray-400'}`}>
                Administração/Brinquedos
              </li>
            </Link>
            <Link to="/users" title="Users">
              <li className={`p-4 font-semibold shadow-sm text-gray-500 ${location.pathname === "/users" ? 'bg-tdb-cyan text-tdb-gray' : 'hover:text-gray-400'}`}>
                Administração/Usuários
              </li>
            </Link>
          </div>
        )}
        <Link to="/team" title="Nossa Equipe">
          <li className={`p-4 font-semibold shadow-sm text-gray-500 ${location.pathname === "/team" ? 'bg-tdb-cyan text-tdb-gray' : 'hover:text-gray-400'}`}>
            Equipe
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
