const People = require('../models').People;
const Webflow = require('webflow-api');
// Initialize the API 
const webflow = new Webflow({ token: 'TODO' });

exports.create = function(req, res) {
    return People
    .create({
        name: req.body.name,
    })
    .then(person => res.status(201).send(person))
    .catch(error => res.status(400).send(error));
};

exports.list = function(req, res) {
    return People
    .all()
    .then(people => res.status(200).send(people))
    .catch(error => res.status(400).send(error));
};

exports.webflow_upload = function(req, res){
    
    var personArray = [];
    var resolvedPromiseArray = [];
    var webflowObjectArray = [];
    
    // this determines how much of a collection to go through (e.g. 0-5 means first 500)
    for(var x = 0; x<5; x++){
        
        // limit cannot exceed 100 but offset can be used to 'ignore' a number of results at the beginning
        const items = webflow.items({ collectionId: 'TODO' }, { limit: 100, offset: x * 100});
    
        // pushes promise to array
        resolvedPromiseArray.push(items);
        
        // builds an array of all of the Webflow objects
        items.then(function(webflowObjects){
            return webflowObjectArray.push.apply(webflowObjectArray, webflowObjects.items);
        })
    }

    // once all the promises in the resolvedPromiseArray have been resolved, creates item array and add all to database
    Promise.all(resolvedPromiseArray).then(function(){
        return Promise.all(webflowObjectArray.map(function(item){
            person = {
                'name': item.name
            }
            return person
        }));
    })
    .then(function(personArray){
        // takes array of Sequelize friendly objects and puts them into database
        People.bulkCreate(personArray, {returning: true}).then(people => res.status(200).send(people));
    })
    .catch(error => res.status(400).send(error)); 
};



exports.delete_all = function(req, res){
    return People
    .destroy({
        where: {}
    })
    .then(() => res.status(200).send({message: 'deleted'}))
    .catch(error => res.status(400).send(error));  
};