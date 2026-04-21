import { Link } from "react-router-dom";

import { categories } from "../../database/categories";

export const CategoryNav = () => {
  return (
  <aside className="hidden lgxl:flex">
  <div className="category-nav-card bg-primary flex flex-col w-[286px] rounded-[8px] overflow-hidden">
        <div className="bg-accent py-4 text-primary uppercase font-semibold flex items-center justify-center">
          Categorias
        </div>
  <div className="flex-1 overflow-y-auto thin-scrollbar flex flex-col gap-y-6 p-6">
          {categories.map((category) => (
            <Link
              to={`/products/${category.id}`}
              className="cursor-pointer uppercase"
              key={category.id}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};
