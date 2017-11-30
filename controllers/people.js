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
            
            // this determines how much of a collection to go through (e.g. 0-5 means first 500)
            for(var x = 0; x<5; x++){
                
                // limit cannot exceed 100 but offset can be used to 'ignore' a number of results at the beginning
                const items = webflow.items({ collectionId: 'TODO' }, { limit: 100, offset: x * 100});
    
                // pushes promise to array
                resolvedPromiseArray.push(items);
    
                // gets the an array of items, updates them to fit with the schema and then adds them to sessionArray
                items.then(function(i){
                    var itemArray = i.items;
                    // to put items into 'schema friendly' format
                    var updatedItemArray = [];
                    itemArray.forEach(function(item) {
                        // creates array from Webflow items
                        updatedItem = {
                                        'name': item.name,
                                    }
                        updatedItemArray.push(updatedItem)
                    });
                    personArray.push.apply(personArray, updatedItemArray); 
                });
            } 
            
            // once all the promises in the resolvedPromiseArray have been resolved, add all to database
            Promise.all(resolvedPromiseArray).then(function(){
                People.bulkCreate(personArray, {returning: true}).then(people => res.status(200).send(people))
            });
        },

exports.delete_all = function(req, res){
    return Person
    .destroy({
        where: {}
    })
    .then(() => res.status(200).send({message: 'deleted'}))
    .catch(error => res.status(400).send(error));  
}