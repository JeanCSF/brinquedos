import { MdToys } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../utils/UserContext';

const Header: React.FC = () => {
  const { user } = useUserContext();

  return (
    <div className="bg-gray-200 w-100 p-1 absolute right-0 left-0">
      <div className="flex items-center justify-between text-center font-bold text-stone-600">
        <div style={{ width: 156, height: 60 }} className="border border-purple-800 flex justify-center items-center">
          <Link to="/home" title="Home">
            <MdToys className="text-3xl" />
          </Link>
        </div>
        <p className="text-3xl">TOYS DB</p>
        <div style={{ width: 60, height: 60 }} className="rounded-full border border-purple-800">
        </div>
      </div>
    </div>
  );
};

export default Header;
