import { MdBuildCircle } from "react-icons/md";

export const BuildPopUp = ({ isOpenPopUp, setIsOpenPopUp }: any) => {
  const closeModal = () => {
    setIsOpenPopUp(false);
  };

  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden transition-opacity duration-300 ${
        isOpenPopUp ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      arial-modal="true"
      role="dialog"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative rounded-lg shadow bg-gray-700">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
            onClick={closeModal}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="flex flex-1 flex-col gap-3 items-center p-4 md:p-5 text-center">
            <MdBuildCircle fontSize="10rem" className="text-gray-300" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Funcionalidade em construção!
            </h3>
            <button
              data-modal-hide="popup-modal"
              type="button"
              className="button bg-gray-300 text-primary w-full px-5 py-2.5"
              onClick={closeModal}
            >
              Aguardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
