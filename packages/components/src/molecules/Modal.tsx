import React, {
  KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { FlexCol } from "../atoms";
import { BaseComponent, BaseComponentProps } from "@torthu/jacketui-base";
import { tabFocusLock } from "../utils";
import { useDomEventListener } from "../hooks";

export const modalVariants = {
  default: "",
  ingredientPicker:
    "w-full md:m-8 max-h-screen max-w-screen-lg bg-slate-900 md:rounded-xl border border-slate-700 pb-8 relative overflow-auto shadow-2xl",
  infoSnippet:
    "my-auto bg-slate-900 rounded-xl border border-slate-700 relative overflow-auto shadow-2xl max-w-96",
  dialog:
    "my-auto bg-slate-900 rounded-xl border border-slate-700 relative overflow-auto shadow-2xl",
};

export interface ModalProps
  extends BaseComponentProps<keyof typeof modalVariants> {
  onClose: () => void;
}

export function Modal({
  className = "",
  onClose,
  variant = "default",
  as = FlexCol,
  ...rest
}: ModalProps) {
  useDomEventListener(document, "keydown", (e: any) =>
    e.code === "Escape" ? onClose() : null
  );
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unlock: () => void | undefined;
    document.body.style.overflow = "hidden";

    if (dialogRef.current) {
      unlock = tabFocusLock(dialogRef.current);
    }

    return () => {
      unlock?.();
      document.body.style.overflow = "unset";
    };
  }, []);

  const classNames = `${modalVariants[variant]} ${className}`;

  return (
    <div
      role="dialog"
      onClick={onClose}
      className="fixed p-0 md:p-8 top-0 bottom-0 overflow-auto left-0 right-0 flex justify-center bg-black bg-opacity-80 z-20 "
      ref={dialogRef}
    >
      <BaseComponent
        onClick={(e) => e.stopPropagation()}
        className={classNames}
        {...rest}
      ></BaseComponent>
    </div>
  );
}
