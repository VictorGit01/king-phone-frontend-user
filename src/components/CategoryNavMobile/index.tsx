import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";

import { categories } from "../../database/categories";

export const CategoryNavMobile = ({ setCatNavMobile }: any) => {
  return (
    <div className="w-full h-full bg-primary p-8">
      {/* close icon */}
      <div
        onClick={() => setCatNavMobile(false)}
        className="flex justify-end mb-8 cursor-pointer"
      >
        <FiX className="text-3xl" />
      </div>
      <div className="flex flex-col gap-y-8">
        {/* Navegação principal */}
        <div className="border-b border-gray-700 pb-6 mb-2">
          <h3 className="text-gray-400 text-sm uppercase mb-4">Menu Principal</h3>
          <div className="flex flex-col gap-y-4">
            <Link
              to="/"
              className="uppercase font-medium"
              onClick={() => setCatNavMobile(false)}
            >
              Início
            </Link>
            <Link
              to="/products"
              className="uppercase font-medium"
              onClick={() => setCatNavMobile(false)}
            >
              Todos os Produtos
            </Link>
            <Link
              to="/contact"
              className="uppercase font-medium"
              onClick={() => setCatNavMobile(false)}
            >
              Contato
            </Link>
          </div>
        </div>

        {/* Categorias */}
        <div>
          <h3 className="text-gray-400 text-sm uppercase mb-4">Categorias</h3>
          <div className="flex flex-col gap-y-4">
            {categories?.map((category) => (
              <Link
                to={`products/${category.id}`}
                className="uppercase font-medium"
                key={category.id}
                onClick={() => setCatNavMobile(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
