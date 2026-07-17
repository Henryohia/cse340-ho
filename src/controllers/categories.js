// Import any needed model functions
import { getAllCategories, getCategoryById, getProjectsByCategoryId, getCategoryDetails } from '../models/categories.js';

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



// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };

