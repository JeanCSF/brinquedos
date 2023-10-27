import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import Dropdown from '../dropdown/Dropdown';

import headerIcon from '../../../public/icon-header.svg';

const Header: React.FC = () => {
  const { userImg, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="bg-indigo-700 w-full p-1 fixed top-0 z-50">
      <div className="flex items-center justify-between text-center font-bold text-stone-600">
        <div className="border border-emerald-50 p-2">
          <Link to="/" title="Home">
            <img src={headerIcon} alt="header-icon" className="w-10 h-10" />
          </Link>
        </div>
        <p className="text-3xl text-emerald-50">TOYDB</p>
        <div className="relative">
          <div className="rounded-full border border-emerald-50 cursor-pointer" onClick={toggleDropdown}>
            {userImg && (
              <img
                src={userImg.toString().replace(/['"]+/g, '')}
                alt="profile"
                className="w-14 h-14 p-1 rounded-full"
              />
            )}
          </div>
          {dropdownOpen && (
            <Dropdown>
              <ul>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
