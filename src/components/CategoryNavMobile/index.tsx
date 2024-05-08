import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";

import { categories } from "../../services/categories";

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
  );
};
