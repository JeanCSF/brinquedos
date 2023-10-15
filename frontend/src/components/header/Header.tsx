import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import { MdToys } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Dropdown from '../dropdown/Dropdown';
import './Header.css';

const Header: React.FC = () => {
  const { userImg, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout(); // implement your logout function
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="bg-gray-200 w-100 p-1 absolute right-0 left-0">
      <div className="flex items-center justify-between text-center font-bold text-stone-600">
        <div
          style={{ width: 117, height: 60 }}
          className="border border-purple-800 flex justify-center items-center"
        >
          <Link to="/" title="Home">
            <MdToys className="text-3xl" />
          </Link>
        </div>
        <p className="text-3xl">TOYS DB</p>
        <div className="relative">
          <div className="rounded-full border border-purple-800 user-img" onClick={toggleDropdown}>
            {userImg && <img src={userImg.toString().replace(/['"]+/g, '')} alt="profile" />}
          </div>
          {dropdownOpen && (
            <Dropdown>
              <ul>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
                {/* Add more options as needed */}
              </ul>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
