module.exports = function(app){

    const controllers = require('../controllers/people');

    app.route('/people')
        .get(controllers.list)
        .post(controllers.create);

    app.route('/webflow_upload')
        .get(controllers.webflow_upload)
        .delete(controllers.delete_all);
}
