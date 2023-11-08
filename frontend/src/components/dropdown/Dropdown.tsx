type DropdownProps = {
  children: React.ReactNode;
};

const Dropdown: React.FC<DropdownProps> = ({ children }) => {
  return (
    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-tdb-gray ring-2 ring-slate-900 ring-opacity-5">
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
