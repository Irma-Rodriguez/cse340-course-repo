import express from 'express';

import { showHomePage } from './controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Show form
router.get('/new-organization', showNewOrganizationForm);

// Process form
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

router.get('/projects', showProjectsPage);

// New route
router.get('/project/:id', showProjectDetailsPage);

//  Show form
router.get('/new-project', showNewProjectForm);

// Process form
router.post('/new-project', projectValidation, processNewProjectForm);

router.get('/edit-project/:id', showEditProjectForm);

router.post('/edit-project/:id', projectValidation, processEditProjectForm);

router.get('/categories', showCategoriesPage);

router.get('/category/:id', showCategoryDetailsPage);

router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);

router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);

router.get('/project/:projectId/assign-categories', showAssignCategoriesForm);

router.post('/project/:projectId/assign-categories', processAssignCategoriesForm);
// error route
router.get('/test-error', testErrorPage);

export default router;