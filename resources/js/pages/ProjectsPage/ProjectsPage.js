import React from "react";
import Header from "../../components/Header/Header";
import ProjectsTable from '../../components/ProjectsTable/ProjectsTable';


const ProjectsPage = () => {
    return (
        <>
            <Header/>
            <h1 style={{textAlign: 'center'}}> Projects Page</h1>
            <ProjectsTable/>
        </>
    );
}
export default ProjectsPage;
