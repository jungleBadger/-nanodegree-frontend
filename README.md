# App developed to meet Udacity Nanodegree requirements.

- Frontend with google maps

### TECHNOLOGIES:
- Node.JS
- VanillaJS
- Knockout
- Google maps API
- Gulp

### DEPENDENCIES
* .env file containing: APP_PORT, APP_SECRET and MAPS_API_KEY (.env_model present on repo) <- The file was hidden. Sorry about that
* Node and NPM
* install libraries with npm install

### Setup
1. Install [Node](http://nodejs.org/) and NPM 
2. Clone this repository
3. Within root folder run `npm install`
4. To build further run `gulp build -m {MODULE_NAME} eg: gulp build -m ko -w`
5. BE SURE TO CHANGE THE .ENV_MODEL TO .ENV IN ORDER TO GET APP VARIABLES UP AND RUNNING
5.1 Create a hidden file named .env within the root folder (same level as app.js)
5.2 insert three variables APP_PORT, APP_SECRET, MAPS_API_KEY
5.3 eg:
```
APP_PORT=6009
APP_SECRET=UD4ci1t1*
MAPS_API_KEY=YOURGOOGLEAPIKEY
``` 

### To Run
1. From root folder run `node app.js`

### Application
app is running on [Heroku](https://udacity-frontend.herokuapp.com/)