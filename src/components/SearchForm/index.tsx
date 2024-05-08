// icons
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
// useNavigate hook
import { useNavigate } from "react-router-dom";

export const SearchForm = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimating(false);
    }, 1000);

    return () => clearTimeout(timeout);
  });

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchTerm.length > 0) {
      navigate(`/search?query=${searchTerm}`);
      // document.querySelector('input')?.value = '';
      setSearchTerm("");
    } else {
      // if input is empty set animation to true
      setIsAnimating(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${
        isAnimating ? "animate-shake" : "animate-none"
      } w-full relative`}
    >
      <input
        value={searchTerm}
        onChange={handleSearchInput}
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
