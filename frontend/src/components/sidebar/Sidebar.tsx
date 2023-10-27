import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  handleToggle: () => void;
  isAdm: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, handleToggle, isAdm }) => {
  return (
    <div className={`sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 h-screen w-48 bg-gray-200 transition-transform duration-300 ease-in-out`}>
      <div className="sidebar-toggle p-4">
        <FaBars onClick={handleToggle} />
      </div>
      <ul className="sidebar-menu z-50 pt-16">
        <li className="p-4">
          <Link to="/" title="Home">
            Home
          </Link>
        </li>
        {isAdm == '1' && (
          <li className="p-4">
            <Link to="/admin" title="Admin">
              Administração
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
