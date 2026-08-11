import { 
    addVolunteerToProject,
    removeVolunteer
} from "../models/volunteers.js";


const volunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id; // Assuming you have user authentication and the user ID is available in req.user

    try {
        const added = await addVolunteerToProject(userId, projectId);
        if (added) {
            req.flash('success', 'You have successfully volunteered for this project!');
        } else {
            req.flash('info', 'You are already volunteering for this project.');
        }
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error volunteering for project:', error);
        req.flash('error', 'There was an error while trying to volunteer for this project.');
        res.redirect(`/project/${projectId}`);
    }
};

const removeVolunteerFromProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id; // Assuming you have user authentication and the user ID is available in req.user

    try {
        const removed = await removeVolunteer(userId, projectId);
        if (removed) {
            req.flash('success', 'You have successfully removed your volunteer status for this project.');
        } else {
            req.flash('info', 'You are not volunteering for this project.');
        }
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error removing volunteer from project:', error);
        req.flash('error', 'There was an error while trying to remove your volunteer status for this project.');
        res.redirect(`/project/${projectId}`);
    }
}

export {
    volunteerForProject,
    removeVolunteerFromProject
};