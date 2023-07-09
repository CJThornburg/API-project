import React from "react";
import { useModal } from "../../context/Modal";
import './OpenModalButton.css';

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  from
}) {

  const { setModalContent, setOnModalClose } = useModal();

  console.log(from)
  const onClick = () => {
    if (typeof onButtonClick === "function") onButtonClick();
    if (typeof onModalClose === "function") setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  return <button className={from=== "GD"? "Gd-action-btn cursor": "cursor"} onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;
