// src/components/Sidebar.tsx
import './Sidebar.css'

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <div className={`bg-gray-200 w-64 min-h-screen p-4 absolute top-0 left-0 transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="bg-gray-200 h-full w-64 p-4">
        <ul>
          <li className="mb-4">
            <a href="#" className="text-blue-500 hover:text-blue-700">
              Item 1
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="text-blue-500 hover:text-blue-700">
              Item 2
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="text-blue-500 hover:text-blue-700">
              Item 3
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;