type PopUpModalProps = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  handleConfirm: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "success";
};

export const PopUpModal = ({
  openModal,
  setOpenModal,
  handleConfirm,
  title = "Tem certeza de que deseja excluir este produto do carrinho?",
  confirmText = "Sim, excluir",
  cancelText = "Não, cancelar",
  variant = "danger",
}: PopUpModalProps) => {
  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden transition-opacity duration-300 ${
        openModal ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      arial-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/60" onClick={closeModal} />
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative rounded-lg shadow bg-gray-900 text-gray-100 border border-gray-700">
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
          <div className="p-4 md:p-5 text-center">
            {variant === "success" ? (
              <svg
                className="mx-auto mb-4 w-12 h-12 text-green-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 6 9 17l-5-5"
                />
              </svg>
            ) : (
              <svg
                className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
            <h3 className="mb-5 text-lg font-normal text-gray-300">
              {title}
            </h3>
            <button
              data-modal-hide="popup-modal"
              type="button"
              className={`text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center ${
                variant === "success"
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-300 dark:focus:ring-green-800"
                  : "bg-red-600 hover:bg-red-800 focus:ring-red-300 dark:focus:ring-red-800"
              }`}
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
            {cancelText ? (
              <button
                data-modal-hide="popup-modal"
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-200 focus:outline-none bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-700"
                onClick={closeModal}
              >
                {cancelText}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
