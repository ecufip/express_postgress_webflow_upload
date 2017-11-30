Takes information from a Webflow collection and adds into a table called 'People' in a locally hosted postgres database called 'example-webflow'. It saves information on only 1 field, name, and requires this to be the name of the field in Webflow. Assumes that Postgres/ node are installed.

## Notes on using Sequelize CLI

### Database
This micro-service connects to a locally hosted database. This will need to be created using:

        $ createdb example-webflow

Assuming postgres is running. Alternatively, another database could be defined in the config.json file.

### Creating a DB link
For this project, the db connection was created using sequelize CLI (http://docs.sequelizejs.com/manual/tutorial/migrations.html):

        $ node_modules/.bin/sequelize init

This created the following folders:

- config, contains config file, which tells CLI how to connect with database
- models, contains all models for your project
- migrations, contains all migration files
- seeders, contains all seed files

Now this exists, it does not need to be done again, provided the db exists and config file is correct.

### Creating a schema
The schema was originally created using the following command:

        $ node_modules/.bin/sequelize model:generate --name People --attributes name:string

This creates a table with the field: name. This also creates a migrations file (under the migrations folder) which implements the schema changes to the database.

### Making changes to database
To make changes to the database a migration file must be created using:

        $ sequelize migration:create --name 'decide a name'

This can then be filled out depending on what changes are required (see: http://sequelize.readthedocs.io/en/latest/docs/migrations/#addcolumntablenameoroptions-attributename-datatypeoroptions-options). After this, the migration is implemented using:

        $ node_modules/.bin/sequelize db:migrate

If the migration updates the database, it should be ensured the schema has also been updated in the models folder (some functions don't automatically update this). To reverse a migration:

        $ node_modules/.bin/sequelize db:migrate:undo

There is currently only 1 migration file which creates the 'People' table in the database. This will need to be implemented before usage. 
        
## Webflow
Webflow API info:

https://developers.webflow.com/#cms-api-reference

An API key needs to be created and a collection ID determined before this works.

Webflow only allows 100 entries to be downloaded at once, which is why there is a loop in place. This saves 100 entries to an array, 'offsets' by 100 (i.e. ignores the first 100 and downloads the next 100). This currently happens 5 times to download 500 entries, although this can be changed. Another constraint is that Webflow only allows you to make a certain number of calls per minute, so it may be necessary to do this multiple times over a prolonged period if the dataset is suitably large.

## Usage
To install:

        $ npm install

To set up:

1. Create a local database (see above) called example-webflow/ check the details in config.json file are correct (username etc.)
2. Create a table called 'People' using the migrate command ($ node_modules/.bin/sequelize db:migrate)
3. Create an API key, find the collection ID and input these into the controllers/people.js file

To run on port 3000:

        $ npm start

## Routes

        $ localhost:3000/people 

        GET: lists all people
        POST: creates a person (name required)

        $ localhost:3000/webflow_upload

        GET: uploads people from Webflow and saves them to the database, shows what was uploaded
        DELETE: deletes all people

