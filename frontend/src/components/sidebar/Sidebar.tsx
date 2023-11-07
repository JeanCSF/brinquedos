import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { AuthContext } from '../../contexts/auth';

interface SidebarProps {
  isOpen: boolean;
  handleToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, handleToggle }) => {
  const { isAdm } = useContext(AuthContext);
  const isAdmin = isAdm === "1";

  return (
    <div className={`sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 h-screen w-48 bg-tdb-gray  transition-transform duration-300 ease-in-out`}>
      <div className="sidebar-toggle p-4">
        <FaBars onClick={handleToggle} style={{ "cursor": 'pointer' }} />
      </div>
      <ul className="sidebar-menu z-50 pt-16">
        <li className="p-4">
          <Link to="/" title="Home">
            Home
          </Link>
        </li>
        <li className="p-4">
          <Link to="/catalog" title="Catálogo de Brinquedos">
            Catálogo
          </Link>
        </li>
        {isAdmin && (
          <div>
            <li className="p-4">
              <Link to="/admin" title="Admin">
                Administração/Briquedos
              </Link>
            </li>
            <li className="p-4">
              <Link to="/users" title="Users">
                Administração/Usuários
              </Link>
            </li>
          </div>
        )}
        <li className="p-4">
          <Link to="/team" title="Nossa Equipe">
            Equipe
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
