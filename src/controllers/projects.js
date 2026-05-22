import {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';

// constante pedida por la actividad
const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const id = req.params.id;

    const project = await getProjectDetails(id);

    res.render('project', { project });
};

export {
    showProjectsPage,
    showProjectDetailsPage
};