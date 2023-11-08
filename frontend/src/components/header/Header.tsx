import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import Dropdown from '../dropdown/Dropdown';

import headerIcon from './icon-header.svg';
import { TbLogout2, TbHorseToy, TbUsers } from "react-icons/tb";

const Header: React.FC = () => {
  const { userImg, logout, isAdm } = useContext(AuthContext);
  const isAdmin = isAdm === "1";
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="bg-tdb-gray w-full p-1 fixed top-0 z-50">
      <div className="flex items-center justify-between text-center font-bold text-stone-600">
        <div className="p-2">
          <Link to="/" title="Home">
            <img src={headerIcon} alt="header-icon" className="w-10 h-10" />
          </Link>
        </div>
        <p className="text-3xl text-tdb-red">TOY<span className="text-tdb-yellow">DB</span></p>
        <div className="relative">
          <div className="rounded-full cursor-pointer" onClick={toggleDropdown}>
            {userImg && (
              <img
                src={userImg.toString().replace(/['"]+/g, '')}
                alt="profile"
                className="w-14 h-14 rounded-full"
              />
            )}
          </div>
          {dropdownOpen && (
            <Dropdown>
              <ul>
                {isAdmin && (
                  <>
                    <li>
                      <Link className="flex gap-2 items-center font-semibold mb-3 hover:bg-cyan-300 p-4" to="/admin"><TbHorseToy />Brinquedos</Link>
                    </li>
                    <li>
                      <Link className="flex gap-2 items-center font-semibold mb-3 hover:bg-cyan-300 p-4" to="/users"><TbUsers />Usuários</Link>
                    </li>
                  </>
                )}
                <li>
                  <button className="w-full flex gap-2 items-center font-semibold mb-3 hover:bg-cyan-300 p-4" onClick={handleLogout}><TbLogout2 />Logout</button>
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
