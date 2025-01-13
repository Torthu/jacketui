"use client";

import React from "react";
import { useState } from "react";
import { Button, FlexCol, FlexRow, buttonVariants } from "../atoms";
import { Modal, modalVariants } from "./index";
import { BaseComponent, BaseComponentProps } from "@torthu/jacketui-base";

interface InfoModalProps extends BaseComponentProps {
  buttonTitle: string;
  buttonLabel?: string;
  buttonVariant?: keyof typeof buttonVariants;
  modalVariant?: keyof typeof modalVariants;
  onOpen?: () => void;
  onClose?: () => void;
}
export default function InfoModal({
  buttonTitle,
  buttonLabel = "?",
  buttonVariant = "info",
  modalVariant = "infoSnippet",
  onOpen,
  onClose,
  ...rest
}: InfoModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const close = () => {
    setIsOpen(false);
    onClose?.();
  };
  const open = () => {
    setIsOpen(true);
    onOpen?.();
  };

  return (
    <>
      <Button variant={buttonVariant} title={buttonTitle} onClick={open}>
        {buttonLabel}
      </Button>

      {isOpen && (
        <Modal onClose={close} variant={modalVariant}>
          <FlexCol variant="relaxed" className="p-8">
            <BaseComponent {...rest} />
            <Button
              variant="message"
              onClick={close}
              title="Close dialog"
              className="py-2 px-4"
            >
              <FlexRow variant="tight">Ok</FlexRow>
            </Button>
          </FlexCol>
        </Modal>
      )}
    </>
  );
}
