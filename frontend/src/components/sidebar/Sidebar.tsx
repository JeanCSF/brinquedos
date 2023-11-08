import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { AuthContext } from '../../contexts/auth';

interface SidebarProps {
  isOpen: boolean;
  handleToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, handleToggle }) => {
  const { isAdm } = useContext(AuthContext);
  const isAdmin = isAdm === "1";
  const location = useLocation();

  return (
    <div className={`sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 h-screen w-1/5 bg-tdb-gray  transition-transform duration-300 ease-in-out`}>
      <div className="sidebar-toggle p-4">
        <FaBars onClick={handleToggle} style={{ "cursor": 'pointer' }} />
      </div>
      <ul className="sidebar-menu z-50 pt-16">
        <Link to="/" title="Home">
          <li className={`p-4 font-semibold shadow-sm text-gray-500 ${location.pathname === "/" ? 'bg-tdb-cyan' : 'hover:text-gray-400'}`}>
            Home
          </li>
        </Link>
        <Link to="/catalog" title="Catálogo de Brinquedos">
          <li className={`p-4 font-semibold shadow-sm text-gray-500 ${location.pathname === "/catalog" || location.pathname === "/category" ? 'bg-tdb-cyan' : 'hover:text-gray-400'}`}>
            Catálogo
          </li>
        </Link>
        {isAdmin && (
          <div>
            <Link to="/admin" title="Admin">
              <li className={`p-4 font-semibold shadow-sm text-gray-500 ${location.pathname === "/admin" ? 'bg-tdb-cyan' : 'hover:text-gray-400'}`}>
                Administração/Brinquedos
              </li>
            </Link>
            <Link to="/users" title="Users">
              <li className={`p-4 font-semibold shadow-sm text-gray-500 ${location.pathname === "/users" ? 'bg-tdb-cyan' : 'hover:text-gray-400'}`}>
                Administração/Usuários
              </li>
            </Link>
          </div>
        )}
        <Link to="/team" title="Nossa Equipe">
          <li className={`p-4 font-semibold shadow-sm text-gray-500 ${location.pathname === "/team" ? 'bg-tdb-cyan' : 'hover:text-gray-400'}`}>
            Equipe
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
