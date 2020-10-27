import React from "react";
import Header from "../Header/Header";

const LayoutHeader = ({children}) => {
    return (
        <>
            <Header/>
            {children}
        </>);
}

export default LayoutHeader;
