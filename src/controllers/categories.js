// Import any needed model functions
import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

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

export {
    showCategoriesPage,
    showCategoryDetailsPage
};