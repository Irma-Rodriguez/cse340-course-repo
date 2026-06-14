import bcrypt from 'bcrypt';

import {
    createUser,
    authenticateUser,
    getAllUsers
} from '../models/users.js';

import {
    getVolunteerProjects
} from '../models/projects.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {

        // Crear hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Guardar usuario
        const userId = await createUser(
            name,
            email,
            passwordHash
        );

        console.log('New user created:', userId);

        req.flash(
            'success',
            'Registration successful! Please log in.'
        );

        res.redirect('/');

    } catch (error) {

        console.error('Error registering user:', error);

        req.flash(
            'error',
            'An error occurred during registration.'
        );

        res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

const processLoginForm = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user =
            await authenticateUser(
                email,
                password
            );

        if (user) {

            req.session.user = user;

            req.flash(
                'success',
                'Login successful!'
            );

            console.log(
                'User logged in:',
                user
            );

            return res.redirect('/dashboard');
        }

        req.flash(
            'error',
            'Invalid email or password.'
        );

        res.redirect('/login');

    } catch (error) {

        console.error(
            'Error during login:',
            error
        );

        req.flash(
            'error',
            'An error occurred during login.'
        );

        res.redirect('/login');
    }
};

const processLogout = (req, res) => {

    if (req.session.user) {
        delete req.session.user;
    }

    req.flash(
        'success',
        'Logout successful!'
    );

    res.redirect('/login');
};

const requireLogin = (req, res, next) => {

    if (!req.session || !req.session.user) {

        req.flash(
            'error',
            'You must be logged in to access that page.'
        );

        return res.redirect('/login');
    }

    next();
};

const showDashboard = async (req, res) => {

    const user = req.session.user;

    const volunteerProjects =
        await getVolunteerProjects(
            user.user_id
        );

    res.render(
        'dashboard',
        {
            title: 'Dashboard',
            user,
            name: user.name,
            email: user.email,
            volunteerProjects
        }
    );
};

const showUsersPage = async (req, res) => {

    try {

        const users = await getAllUsers();

        res.render(
            'users',
            {
                title: 'Registered Users',
                users
            }
        );

    } catch (error) {

        console.error(error);

        req.flash(
            'error',
            'Unable to load users.'
        );

        res.redirect('/dashboard');
    }
};

const requireRole = (role) => {
    return (req, res, next) => {

        // Debe estar logueado
        if (!req.session || !req.session.user) {
            req.flash(
                'error',
                'You must be logged in to access this page.'
            );
            return res.redirect('/login');
        }

        // Debe tener el rol correcto
        if (req.session.user.role_name !== role) {
            req.flash(
                'error',
                'You do not have permission to access this page.'
            );
            return res.redirect('/dashboard');
        }

        next();
    };
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
};