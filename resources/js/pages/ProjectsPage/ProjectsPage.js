import React from "react";
import getAccessToken from '../../constants/getAccessToken';
import Header from "../../components/Header/Header";

const ProjectsPage = () => {
    const token = getAccessToken();
    console.log(token)

    return (
        <>
            <Header/>
            <h1> Projects Page Token </h1>
        </>
    );
}
export default ProjectsPage;
