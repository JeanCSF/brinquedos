import BreadCrumb from "../components/breadcrumb/BreadCrumb";

const Error401Page: React.FC = () => {
  const paths = [
    { name: "Home", path: "/" },
    { name: "Administração", path: "/admin" },
  ];
  return (
    <div className="container">
      <BreadCrumb paths={paths}/>
      <div className="flex flex-col items-center">
        <h1 className="text-6xl font-bold text-red-500">401</h1>
        <p className="text-2xl font-medium mt-4">Acesso não autorizado.</p>
      </div>
    </div>
  );
};

export default Error401Page;
