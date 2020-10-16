import React from "react";
import Header from "../../components/Header/Header";
import Tickets from "../../components/Tickets/Tickets";
import Filters from "../../components/Filters/Filters";

const TicketsPage = ()  => {
    return (
        <>
            <Header/>
            <h1>Tickets page</h1>
            <Filters/>
            <Tickets/>
        </>
    )
}

export default TicketsPage;
