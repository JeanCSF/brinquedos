const Footer: React.FC = () => {
    const fullYear = new Date().getFullYear();
    return (
      <div className='bg-tdb-gray w-100 p-4 absolute bottom-0 right-0 left-0'>
        <div className="text-center font-bold text-stone-600">{fullYear}&copy;</div>
      </div>
    );
  };
  
  export default Footer;