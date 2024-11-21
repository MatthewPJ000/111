import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
// import { IoClose } from 'react-icons/io5';
import MainButton from "./mainButton"; // Ensure you have a MainButton component
import BorderButton from "./borderButton"; // Ensure you have a BorderButton component

type Props = {
  isOpen: boolean;
  closeModal: (
    event?: React.MouseEvent<HTMLButtonElement>,
    componentName?: string
  ) => void;
  handleMain?: () => void; // Callback function for the main button
  handleMainTitle?: string; // Title for the main button
  handleCloseTitle?: string;
  children?: React.ReactNode; // Allow children to be passed
};

export default function MediumModal({
  isOpen,
  handleCloseTitle,
  closeModal,
  handleMain,
  handleMainTitle,
  children,
}: Props) {
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="medium-modal-title"
      aria-describedby="medium-modal-description"
    >
      

      <DialogContent>
        {children} {/* Render children here */}
      </DialogContent>

      <DialogActions>
        <div className="flex items-center space-x-2 rtl:space-x-reverse rounded-b mr-10 mb-5 dark:border-gray-600 ">
          <MainButton
            title={handleMainTitle || "Submit"}
            onClick={handleMain}
          />
          <BorderButton
            title={handleCloseTitle || "Delete"}
            onClick={closeModal}
          />
        </div>
      </DialogActions>
    </Dialog>
  );
}
