import './Sidebar.css'
import { Link } from 'react-router-dom';
import { useUserContext } from '../../utils/UserContext';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user } = useUserContext();
  return (
    <div className={`sidebar bg-gray-200 min-h-screen p-4 absolute top-0 left-0 transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="bg-gray-200 w-32">
        <ul className="mt-11 text-center font-bold">
          <li className="mt-4">
            <Link to='/home' title='Home'>
              Home
            </Link>
          </li>
          <li className="mt-4">
            <Link to='/home' title='Home'>
              Admin
            </Link>
          </li>
          <li className="mt-4">
            <Link to='/home' title='Home'>
              Home
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;