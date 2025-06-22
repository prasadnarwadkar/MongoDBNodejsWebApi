# MongoDb Node.js Web API
Theer are two APIs in this repository. One is in the root folder (the main entities API) and another is in the 'server/' folder which is used for authentication and authorization. Both the APIs connect to MongoDb. You can get a new MongoDb cloud account [here](https://cloud.mongodb.com/). Once you create an account, you can create a database and a collection, you can modify the settings in [this file](https://github.com/prasadnarwadkar/mongodbnodejswebapi/blob/master/services/heroesService.js). As an alternative, you can also provision a MongoDb account for yourself on Azure. The MongoDb Node.js driver works just the same in both the cases, only difference is the difference between the cluster Urls.

## Deployment

You can deploy the Web API on any server that can run the Node.js runtime. Alternatives that I know are [IIS on a Windows server or workstation](https://www.hanselman.com/blog/InstallingAndRunningNodejsApplicationsWithinIISOnWindowsAreYouMad.aspx), [Windows Azure](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-nodejs) and Aamazon Web Services. Node.js apps run equally well on Linux and Windows servers.

## Further use

You can add many more services to the same Node.js app or create new apps for more services, each app per service to conform to micro-services architecture. 

## Architecture
The architecture is very simple. It has a starter .js called app.js file that composes a service object that actually connects to a MongoDb cluster. App.js exposes api endpoints.

## Setup-Local
- Install MongoDB locally (localhost port 27017) i.e. `mongodb://127.0.0.1:27017`. Let the default database `test` be used. Alternatively, please create a database of your choice and update the MongoDB URI. 
- Simply run `node app.js` for the main API that serves entities like patients, doctors, etc. 
- For Auth API, run `node .\server\index.js`. This Auth API supports scenarios like register sign up, login, logout etc.
- These APIs are used by the Angular app (Hospital Management System) [here](https://github.com/prasadnarwadkar/AngularExample). Please update the URIs of this APIs in that angular app's env settings. 
- If you run the Angular app for the first time, please register yourself as a user. 
- Then run the following commands in MongoDB shell to setup admin user and roles.

  `db.users.updateOne({ "email" : "<email used to register>" },   { $set: { "roles" : ["admin"] } });` 
  `db.roleactionmaps.insert({"pageName":"roles","rolename":"admin","actions":['read','create','update','delete']});`
  `db.roleactionmaps.insert({"pageName":"users","rolename":"admin","actions":['read','create','update','delete']});`
  `db.roleactionmaps.insert({"pageName":"roleactionmaps","rolename":"admin","actions":['read','create','update','delete']});`
- Afer that, admin can administrate other users, assign roles to them and CRUD their permissions to use actions on pages. 

## Build
Following snippet shows how to connect to a MongoDb db from Node.js app (from [here](https://docs.atlas.mongodb.com/driver-connection/)). Very similar code (except the url to the cluster) can be used for connecting to all kinds of provisions such as Azure, AWS etc.

    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://kay:myRealPassword@cluster0.mongodb.net/admin";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
    });


Simply run `node app.js` to debug and test the app locally. It will be available at the url specified via `var port = process.env.PORT || 1337;`. On cloud deployments, it's accessible from the base urls and api endpoints can be accessed by apending `api/{op}` to the base urls in both the local and cloud deployment. e.g. locally `https://localhost:1337/api/getaccounts`.

### Misc
- curl "http://localhost:3002/api/auth/users/localhost_4200@example.com"
- curl "http://localhost:3002/api/auth/users"
- curl --json "{\"role\": \"user\"}" "http://localhost:3002/api/auth/roles"

### Docker
- `docker build -t prasadnarwadkar/nodejsauthapi . --no-cache`
- `docker run --hostname=88c5df73ac00 --env=JWT_SECRET= --env=MONGO_HOST=mongodb://host.docker.internal:27017 --env=SERVER_PORT=8083 --env=MONGO_DB_NAME=hospital --env=MONGO_URI=mongodb://host.docker.internal:27017 --env=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin --env=NODE_VERSION=22.16.0 --env=YARN_VERSION=1.22.22 --network=bridge --workdir=/usr/src/app -p 8083:8083 --restart=no --runtime=runc -d prasadnarwadkar/nodejsauthapi:latest`
