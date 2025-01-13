import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  ButtonProps,
  FlexCol,
  FlexRow,
  buttonVariants,
} from "../atoms";
import { Modal, modalVariants } from ".";
import { BaseComponent, BaseComponentProps } from "@torthu/jacketui-base";
import { XCircleIcon } from "@heroicons/react/24/outline";

export interface DeleteModalProps extends BaseComponentProps {
  button: Omit<ButtonProps, "onClick" | "as">;
  modalVariant?: keyof typeof modalVariants;
  onOpen?: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
}
export function DeleteModal({
  button,
  modalVariant = "infoSnippet",
  onOpen,
  onConfirm,
  onCancel,
  ...rest
}: DeleteModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const confirm = () => {
    setIsOpen(false);
    onConfirm();
  };

  const cancel = () => {
    setIsOpen(false);
    onCancel?.();
  };
  const open = () => {
    setIsOpen(true);
    onOpen?.();
  };

  return (
    <>
      <Button {...button} onClick={open} />

      {isOpen && (
        <Modal onClose={cancel} variant={modalVariant}>
          <FlexCol variant="relaxed" className="p-8">
            <BaseComponent {...rest} />

            <ButtonGroup variant="dialog">
              <Button
                variant="message-delete"
                onClick={confirm}
                title="Close dialog"
                className="py-2 px-4"
              >
                <XCircleIcon className="w-6 h-6" />
                Delete
              </Button>

              <Button
                variant="message"
                onClick={cancel}
                title="Close dialog"
                className="py-2 px-4"
              >
                <FlexRow variant="tight">Cancel</FlexRow>
              </Button>
            </ButtonGroup>
          </FlexCol>
        </Modal>
      )}
    </>
  );
}
