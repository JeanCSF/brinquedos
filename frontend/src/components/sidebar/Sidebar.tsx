import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';


import './Sidebar.css'

const Sidebar: React.FC = () => {
  const { isAdm } = useContext(AuthContext);
  return (
    <div className="bg-gray-200 min-h-screen p-4 absolute">
      <div className="bg-gray-200 w-32">
        <ul className="font-bold">
          <li>
            <Link to='/' title='Home'>
              Home
            </Link>
          </li>
          {isAdm == '1' && (
            <li className="mt-4">
              <Link to='/' title='Home'>
                Admin
              </Link>
            </li>
          )}
          <li className="mt-4">
            <Link to='/' title='Home'>
              Home
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;