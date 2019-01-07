# MongoDb Node.js Web API
This is an example Web API created in Node.js that connects to MongoDb. You can get a new MongoDb cloud account [here](https://cloud.mongodb.com/). Once you create an account, you can create a database and a collection, you can modify the settings in [this file](https://github.com/prasadnarwadkar/mongodbnodejswebapi/blob/master/services/heroesService.js). As an alternative, you can also provision a MongoDb account for yourself on Azure. The MongoDb Node.js driver works just the same in both the cases, only difference is the difference between the cluster Urls.

## Deployment

You can deploy the Web API on any server that can run the Node.js runtime. Alternatives that I know are [IIS on a Windows server or workstation](https://www.hanselman.com/blog/InstallingAndRunningNodejsApplicationsWithinIISOnWindowsAreYouMad.aspx), [Windows Azure](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-nodejs) and Aamazon Web Services. Node.js apps run equally well on Linux and Windows servers.

## Further use

You can add many more services to the same Node.js app or create new apps for more services, each app per service to conform to micro-services architecture. 

## Architecture
The architecture is very simple. It has a starter .js called app.js file that composes a service object that actually connects to a MongoDb cluster. App.js exposes api endpoints.

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

