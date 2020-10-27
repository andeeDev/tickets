import React from "react";
import StickMessage from "../StickMesage/StickMessage";

const LayoutWithStick = ({children}) => {
    return (
        <>
            {children}
            <StickMessage/>
        </>
    );
}

export default LayoutWithStick;
