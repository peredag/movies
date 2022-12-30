const {check, body} = require('express-validator');


module.exports = [
    check('title')
    .notEmpty()
    .withMessage('campo requerido'),

    check('rating')
    .notEmpty()
    .withMessage('campo requerido'),

    check('awards')
    .notEmpty()
    .withMessage('campo requerido'),

    check('release_date')
    .notEmpty()
    .withMessage('campo requerido'),

    check('genre_id')
    .notEmpty()
    .withMessage('campo requerido'),

]