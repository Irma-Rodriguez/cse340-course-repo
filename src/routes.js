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
    processEditProjectForm,
    volunteerForProject,
    unVolunteerForProject
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

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
} from './controllers/users.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

router.get(
    '/new-organization',
    requireRole('admin'),
    showNewOrganizationForm
);

router.post(
    '/new-organization',
    requireRole('admin'),
    processNewOrganizationForm
);

router.get(
    '/edit-organization/:id',
    requireRole('admin'),
    showEditOrganizationForm
);

router.post(
    '/edit-organization/:id',
    requireRole('admin'),
    processEditOrganizationForm
);

router.get('/projects', showProjectsPage);

// New route
router.get('/project/:id', showProjectDetailsPage);

router.post(
    '/project/:id/volunteer',
    requireLogin,
    volunteerForProject
);

router.post(
    '/project/:id/unvolunteer',
    requireLogin,
    unVolunteerForProject
);

//  Show form
router.get(
    '/new-project',
    requireRole('admin'),
    showNewProjectForm
);

// Process form
router.post(
    '/new-project',
    requireRole('admin'),
    projectValidation,
    processNewProjectForm
);


router.get(
    '/edit-project/:id',
    requireRole('admin'),
    showEditProjectForm
);

router.post(
    '/edit-project/:id',
    requireRole('admin'),
    projectValidation,
    processEditProjectForm
);

router.get('/categories', showCategoriesPage);

router.get('/category/:id', showCategoryDetailsPage);

router.get(
    '/new-category',
    requireRole('admin'),
    showNewCategoryForm
);

router.post(
    '/new-category',
    requireRole('admin'),
    processNewCategoryForm
);

router.get(
    '/edit-category/:id',
    requireRole('admin'),
    showEditCategoryForm
);

router.post(
    '/edit-category/:id',
    requireRole('admin'),
    categoryValidation,
    processEditCategoryForm
);

router.get(
    '/project/:projectId/assign-categories',
    requireRole('admin'),
    showAssignCategoriesForm
);

router.post(
    '/project/:projectId/assign-categories',
    requireRole('admin'),
    processAssignCategoriesForm
);

// error route
router.get('/test-error', testErrorPage);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get(
    '/dashboard',
    requireLogin,
    showDashboard
);

router.get(
    '/users',
    requireRole('admin'),
    showUsersPage
);

export default router;