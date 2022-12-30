const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const {validationResult} = require('express-validator'); /* ******************** */
//const { all } = require('sequelize/types/lib/operators');


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll()
        .then((allGenres) => {
            res.render('moviesAdd', {
                allGenres
            })
        })
    },
    create: function (req,res) {
        const errors = validationResult(req);

        if(errors.isEmpty()){
            const {title, rating, awards, release_date, length, genre_id} = req.body;

            Movies.create({title, rating, awards, release_date, length, genre_id}) //.create devuelve una promesa
            .then((movie) => {  // .then captura el resultado de la promesa
                res.redirect('/movies')
            }) 
            .catch((error) => console.log(error));
        }else{
            db.Genre.findAll() //es lo que esta en el metodo add , arriba
            .then((allGenres) => {
                res.render('moviesAdd', {
                    allGenres,
                    errors: errors.mapped(), // pero le agrega esta linea para buscar errores
                    old: req.body  // old hace que pueda persistir los datos, osea que no se borren cuando muestra el error
                })
            })
            .catch((error) => console.log(error));
        }
    },
    edit: function(req,res) {
      const movie = Movies.findByPk(req.params.id); // esto devuelve una promesa
      const genres = Genres.findAll(); // esto tamb devuelve promesa
      
      //Promise.all([]) ---es un objeto que contiene propiedades y metodos
      // para capturar las dos promesas arriba usar Promise.all y le pasamos un array []
      Promise.all([movie, genres]) //movie es como esta definida en variable mas arriba
      .then(([Movie, allGenres]) => { //en el then tamb captura un array[movies, genres]
      //  res.send(allGenres)
        res.render('moviesEdit', {
            Movie,
            allGenres
        })
      })
      .catch((error) => console.log(error));
    },
    update: function (req,res) {
        const errors = validationResult(req);  //copia y pega create

        if(errors.isEmpty()){ 
            const {title, rating, awards, release_date, length, genre_id} = req.body;

            Movies.update({title, rating, awards, release_date, length, genre_id},{ where:{id: req.params.id} }) //.create devuelve una promesa
            .then(() => {  // .then captura el resultado de la promesa
                res.redirect('/movies')
            }) 
            .catch((error) => console.log(error));
        }else{
            const movie = Movies.findByPk(req.params.id);
            const genres = Genres.findAll();
            
            //Promise.all([]) ---es un objeto que contiene propiedades y metodos
            Promise.all([movie, genres]) //movie es como esta definida en variable mas arriba
            .then(([Movie, allGenres]) => { //en la vista esta Movie con mayuscula
            //  res.send(allGenres)
              res.render('moviesEdit', {
                  Movie,
                  allGenres,
                  errors: errores.mapped(),
                  old:req.body
              })
            })
            .catch((error) => console.log(error));  
        }
    },
    delete: function (req,res) {
        Movies.findByPk(req.params.id)
        .then((Movie) => {
            res.render('moviesDelete', {
                Movie
            })
        })
        .catch((error) => console.log(error));
    },
    destroy: function (req,res) {
        Movies.destroy({
            where: {
               id: req.params.id
            }
        })
        .then((result)=> {
            if(result){
                res.redirect('/movies')
            }
        })
        .catch((error) => console.log(error));
    }
}

module.exports = moviesController;