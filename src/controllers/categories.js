// Import any needed model functions
import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId, 
    getCategoryDetails, 
    getCategoriesByProjectId,
    createCategory
 } from '../models/categories.js';

 import { body, validationResult } from "express-validator";

// Define validation and sanitization rules for category form
// Define validation rules for category form
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Category name must be between 3 and 150 characters')
];

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = "Categories";
    res.render("categories", { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    const title = 'Category Details';
    res.render("category", { title: category.name, categoryDetails, category, projects });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = "Assign Categories to Porject";

    res.render("assign-categories", { title, projectId, projectDetails, categories, assignedCategories });

};


const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategories = res.body.categoryId || [];

    // Ensure selectedCategoryId is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash("success", "Categories updated successfully.");
    res.redirect(`/project/${projectId}`);
}

const showNewCategoryForm = async (req, res) => {
    const title = "Add New Category";

    res.render("new-category", {title});
}

const processNewCategoryForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((Error) => {
            req.flash("error", error.msg);
        });

        // Redirect back to the new Category form
        return res.redirect("/new-category");
    }

    const { name } = req.body;

    const CategoryId = await createCategory(name);

    req.flash("success", "Category added successfully!");

    res.redirect(`/category/${categoryId}`);
}

const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);

    const title = "Edit Category";
    res.render("edit-category", { title, categoryDetails });
};

const processEditCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((Error) => {
            req.flash("error", error.msg);
        });

        // Redirect back to the new Category form
        return res.redirect("/edit-category" + req.params.id);
    }
    const categoryId = req.params.id;
    const { name } = req.body;
    
    await updateCategory(categoryId, name);

    // Set a success flsh message
    req.flash("success", "Category updated successfully!");

    res.redirect(`/category/${categoryId}`);

}

// Export any controller functions
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

