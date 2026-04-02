import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
    return (
        <div className="fixed">
            <div className="">
                <div className="" onClick={onClose}></div>

                <div className="">
                    <button onClick={onClose} className="">
                        <X className="" strokeWidth={2} />
                    </button>
                    <div className="">
                        <h3 className="">{title}</h3>
                    </div>

                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
