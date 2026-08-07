
import { 
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
 } from "./controllers/users.js";


import express from "express";

import { showHomePage } from "./controllers/index.js";
import { 
    showNewOrganizationForm, 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm 
} from "./controllers/organization.js";

import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm 
} from "./controllers/projects.js";

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
 } from "./controllers/categories.js";

import { testErrorPage } from "./controllers/errors.js";
// import { showOrganizationDetailsPage } from "./controllers/organization.js";
// import {  } from "./controllers/projects.js";
import { getCategoriesByProjectId } from "./models/categories.js";
import { validationResult } from "express-validator";


const router = express.Router();

// Routes for Users page
router.get("/users", requireLogin, requireRole("admin"), showUsersPage)

// Protected dashboard route
router.get("/dashboard", requireLogin, showDashboard);


// User login routes
router.get("/login", showLoginForm);
router.post("/login", processLoginForm);
router.get("/logout", processLogout);

// User registration routes
router.get("/register", showUserRegistrationForm);
router.post("/register", processUserRegistrationForm);

router.get("/", showHomePage);
router.get("/organizations", showOrganizationsPage);
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);
router.get("/categories", showCategoriesPage);

//error-handling routes
router.get("/test=error", testErrorPage);

//Route for organization details page
router.get("/organization/:id", showOrganizationDetailsPage);

// Route for Category details page
router.get("/category/:id", showCategoryDetailsPage);
// router.get("/category/:id", showCategoryDetailsPage);

// Route for new organization page
router.get("/new-organization", requireRole("admin"), showNewOrganizationForm);

// Route to handle new orgainzation form submission
router.post("/new-organization", requireRole("admin"), organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get("/edit-organization/:id", requireRole("admin"), showEditOrganizationForm);

router.post("/edit-organization/:id", requireRole("admin"), organizationValidation, processEditOrganizationForm);


// Route for new organization page
router.get("/new-project", requireRole("admin"), showNewProjectForm);

// Route to handle new orgainzation form submission
router.post("/new-project", requireRole("admin"), projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
// Redirect bare /assign-categories to projects listing (admin-only)
// router.get("/assign-categories", requireRole("admin"), (req, res) => res.redirect('/projects'));
router.get("/assign-categories/:projectId", requireRole("admin"), showAssignCategoriesForm);
router.post("/assign-categories/:projectId", requireRole("admin"), processAssignCategoriesForm);

// Route to display the edit project form
router.get("/edit-project/:id", requireRole("admin"), showEditProjectForm);
router.post("/edit-project/:id", requireRole("admin"), projectValidation, processEditProjectForm);


// Route for new Category page
router.get("/new-category", requireRole("admin"), showNewCategoryForm);

// Route to handle new category form submission
router.post("/new-category", requireRole("admin"), categoryValidation, processNewCategoryForm);

// Route to display the edit Category form
router.get("/edit-category/:id", requireRole("admin"), showEditCategoryForm);

router.post("/edit-category/:id", requireRole("admin"), categoryValidation, processEditCategoryForm);

export default router;