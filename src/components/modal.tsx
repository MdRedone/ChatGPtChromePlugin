// import { h } from 'preact';

// interface ModalProps {
//   showModal: boolean;
//   closeModal: () => void;
//   children: JSX.Element | JSX.Element[];
// }

// const Modal: React.FC<ModalProps> = ({ showModal, closeModal, children }) => {
//   if (!showModal) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Overlay */}
//       <div className="fixed inset-0 transition-opacity">
//         <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//       </div>
  
//       {/* Modal dialog */}
//       <div className="z-10 bg-white max-w-md p-6 rounded-lg shadow-xl">
//         {/* Modal header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl">Please create a category</h2>
//           <button
//             className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
//             onClick={closeModal}
//           >
//             X
//           </button>
//         </div>
  
//         {/* Modal body */}
//         <div className="text-sm">
//           <div className="mb-4">
//             <input
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               type="text"
//               placeholder="Please enter the category name"
//             >
//                 Enter:
//             </input>
//           </div>
//           <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
//             Submit
//           </button>
//         </div>
  
//         {/* Children */}
//         {children}
//       </div>
//     </div>
//   );
// }

// export default Modal;
  


// import { h } from 'preact';

// interface ModalProps {
//   showModal: boolean;
//   closeModal: () => void;
//   children: JSX.Element | JSX.Element[];
// }

// const Modal: React.FC<ModalProps> = ({ showModal, closeModal, children }) => {
//   if (!showModal) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="fixed inset-0 transition-opacity">
//         <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//       </div>
//       <div className="z-10 bg-white max-w-md p-6 rounded-lg shadow-xl">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl">Please create a category</h2>
//           <button
//             className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
//             onClick={closeModal}
//           >
//             X
//           </button>
//         </div>
//         <div className="text-sm">
//           <div className="mb-4">
//             {/* <h3 className="text-lg font-semibold">Modal Content</h3> */}
//             {/* <p>This is the content of the modal.</p> */}
//             <input placeholder="Please enter the category name">Enter: </input>
//           </div>
//           <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
//             Submit
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default Modal;
import { h, FunctionalComponent } from 'preact';
import { v4 as uuidv4 } from 'uuid';

interface ModalProps {
  showModal: boolean;
  closeModal: () => void;
  // onSubmit: (category: string) => void;
  onSubmit: (category: { uuid: string; name: string }) => void;
}

const Modal: FunctionalComponent<ModalProps> = ({ showModal, closeModal, onSubmit }) => {
  if (!showModal) {
    return null;
  }

  // const handleSubmit = () => {
  //   const inputElement = document.getElementById('categoryInput') as HTMLInputElement;
  //   const categoryName = inputElement.value.trim();
  //   onSubmit(categoryName);
  //   closeModal();
  // };

  // To generate new uuid for every category when the user creates new category from the modal
  const handleSubmit = () => {
    const inputElement = document.getElementById('categoryInput') as HTMLInputElement;
    const categoryName = inputElement.value.trim();

    // Generate a UUID for the new category
    const newCategory = {
      uuid: uuidv4(),
      name: categoryName,
    };

    onSubmit(newCategory);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      {/* Modal dialog */}
      <div className="z-10 bg-white max-w-md p-6 rounded-lg shadow-xl">
        {/* Modal header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Please create a category</h2>
          <button
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            onClick={closeModal}
          >
            X
          </button>
        </div>

        {/* Modal body */}
        <div className="text-sm">
          <div className="mb-4">
            <input
              id="categoryInput"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Please enter the category name"
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;



