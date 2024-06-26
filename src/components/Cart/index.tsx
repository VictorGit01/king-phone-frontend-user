import { FiX } from "react-icons/fi";

export const Cart = ({ setIsOpen }: any) => {
  return (
    <div className="w-full h-full bg-primary p-8">
      {/* close icon */}
      <div
        onClick={() => setIsOpen(false)}
        className="flex justify-end mb-8 cursor-pointer"
      >
        <FiX className="text-3xl" />
      </div>
      Cart
    </div>
  );
};
