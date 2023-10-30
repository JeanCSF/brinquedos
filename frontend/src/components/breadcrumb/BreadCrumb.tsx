import { Link } from "react-router-dom";

type BreadcrumbProps = {
  paths: { name: string; path: string }[];
};

const BreadCrumb: React.FC<BreadcrumbProps> = ({ paths }) => {
  return (
    <nav className="text-sm ms-8" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex">
        {paths.map((path, index) => (
          <li className="flex items-center" key={index}>
            {index > 0 && (
              <svg
                className="h-5 w-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L8.586 12 5.293 8.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <Link
              to={path.path}
              className={`text-gray-500 ${
                index === paths.length - 1 ? "font-medium" : ""
              }`}
            >
              {path.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
