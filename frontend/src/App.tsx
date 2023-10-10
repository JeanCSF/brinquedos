import { Outlet } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa'

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen}/>
      <div className="flex-grow">
        <button className="text-2xl absolute top-2 left-2" onClick={toggleSidebar}><FaBars /></button>
        <Outlet />
      </div>
    </div>
  );
};

export default App;
