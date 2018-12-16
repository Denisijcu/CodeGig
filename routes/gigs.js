const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../models/Gig');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
router.get('/', (req, res) =>
    Gig.findAll()
    .then(gigs => {
        res.render('gigs', {
            gigs
        });
    })
    .catch(err => console.log(err)));

// Display add gig form
router.get('/add', (req, res) => {
    res.render('add')
});

// Add a gig
router.post('/add', (req, res) => {
   
    let {
        title,
        technologies,
        boudget,
        description,
        contact_email
    } = req.body;

    let errors = [];

    //validate fiels
    if(!title){
        errors.push({text: 'Please add a title'});
    }
    if(!technologies){
        errors.push({text: 'Please add a technology'});
    }

    if(!description){
        errors.push({text: 'Please add a description'});
    }

    if(!contact_email){
        errors.push({text: 'Please add a contact email'});
    }



    if (errors.length>0){
        res.render('add', {
            errors,
            title,
            technologies,
            boudget,
            description,
            contact_email
        });
    }else{
        if(!boudget){
            boudget = 'Unknown';
        }else{
            boudget = `$${boudget}`;
        }

         // make lowercase and remove space after comma
        technologies = technologies.toLowerCase().replace(/, /g, ',');

        Gig.create({
            title,
            technologies,
            description,
            boudget,
            contact_email
        })
        .then(gig => res.redirect('/gigs'))
        .catch(err => console.log(err));
    }


});

//Search for gigs 
router.get('/search', (req, res) => {
    const {term} = req.query;
    term = term.toLowerCase();
    
    Gig.findAll({ where: {technologies: { [Op.like]: '%'+term+'%'}}})
    .then(gigs => res.render('gigs', {gigs}))
    .catch(err => console.log(err));
})

   



module.exports = router;