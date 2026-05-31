import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject  
} from '../models/projects.js';

import { getCategoriesByProjectId } from '../models/categories.js';

import { getAllOrganizations } from '../models/organizations.js';

import { body, validationResult } from 'express-validator';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),

    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),

    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),

    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

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

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', {
        title,
        organizations
    });
};

const processNewProjectForm = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        const newProjectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);

    } catch (error) {
        console.error(error);
        req.flash('error', 'Error creating project');
        res.redirect('/new-project');
    }
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    if (!project) {
        return res.status(404).send("Project not found");
    }

    res.render('update-project', {
        title: 'Edit Project',
        project,
        organizations
    });
};

const processEditProjectForm = async (req, res) => {

    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-project/${req.params.id}`);
    }

    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;

    try {
        await updateProject(
            projectId,
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${projectId}`);

    } catch (error) {
        console.error(error);
        req.flash('error', 'Error updating project');
        res.redirect(`/edit-project/${projectId}`);
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,      
    processEditProjectForm   
};