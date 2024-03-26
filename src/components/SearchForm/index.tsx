// icons
import { FiSearch } from "react-icons/fi";

export const SearchForm = () => {
  return (
    <form className="w-full relative">
      <input
        className="input"
        type="text"
        placeholder="Procurar por um produto..."
      />
      <button className="button button-accent absolute top-0 right-0 rounded-tl-none rounded-bl-none">
        <FiSearch className="text-xl" />
      </button>
    </form>
  );
};
