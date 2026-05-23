import {
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';

import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).send("Invalid project ID");
        }

        const project = await getProjectDetails(id);

        if (!project) {
            return res.status(404).send("Project not found");
        }

        // New part
        const categories = await getCategoriesByProjectId(id);

        res.render('project', {
            title: project.title,
            project,
            categories
        });

    } catch (err) {
        console.error("Error loading project:", err);
        next(err);
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage
};