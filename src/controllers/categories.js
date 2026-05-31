// Import any needed model functions
import { getProjectDetails } from '../models/projects.js';

import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments
} from '../models/categories.js';

import { body, validationResult } from 'express-validator';

import { createCategory, updateCategory } from '../models/categories.js';

const categoryValidation = [
    body('category_name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ max: 100 }).withMessage('Max length is 100 characters')
];

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();

    const title = 'Service Categories';

    res.render('categories', {
        title,
        categories
    });
};

// Category details page
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const category = await getCategoryById(id);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        const projects = await getProjectsByCategoryId(id);

        res.render('category', {
            title: category.category_name,
            category,
            projects
        });

    } catch (err) {
        next(err);
    }
};

const showAssignCategoriesForm = async (req, res) => {

    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    res.render('assign-categories', {
        title: "Assign Categories to Project",
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};

const processAssignCategoriesForm = async (req, res) => {

    const projectId = req.params.projectId;

    let selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);

    req.flash('success', 'Categories updated successfully');

    res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'Create Category'
    });
};

const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(e => req.flash('error', e.msg));
        return res.redirect('/new-category');
    }

    const { category_name } = req.body;

    try {
        const id = await createCategory(category_name);
        req.flash('success', 'Category created successfully');
        res.redirect(`/category/${id}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error creating category');
        res.redirect('/new-category');
    }
};

const showEditCategoryForm = async (req, res) => {
    const id = Number(req.params.id);

    const category = await getCategoryById(id);

    if (!category) {
        return res.status(404).send('Category not found');
    }

    res.render('edit-category', {
        title: 'Edit Category',
        category
    });
};

const processEditCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    const id = req.params.id;

    if (!errors.isEmpty()) {
        errors.array().forEach(e => req.flash('error', e.msg));
        return res.redirect(`/edit-category/${id}`);
    }

    const { category_name } = req.body;

    try {
        await updateCategory(id, category_name);
        req.flash('success', 'Category updated successfully');
        res.redirect(`/category/${id}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error updating category');
        res.redirect(`/edit-category/${id}`);
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};