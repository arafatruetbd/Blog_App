const authRoute = require('./authRoute');
const dashboardRoute = require('./dashboarRoute');
const uploadroute = require('./uploadRoute')
const postRoute = require('./postRoute')
const explorerRoute = require('./explorerRoute')
const apiRoute = require('../api/routes/apiRoute')
const searchRoute = require('./searchRoute')
const authorRoute = require('./authorRoute')


const routes = [
    {
        path: '/auth',
        handler: authRoute
    },
    {
        path: '/dashboard',
        handler: dashboardRoute  
    },
    {
        path: '/uploads',
        handler:uploadroute
    },
    {
        path: '/posts',
        handler: postRoute
    },
    {
        path: '/explorer',
        handler: explorerRoute
    },
    {
        path: '/search',
        handler: searchRoute
    },
    {
        path: '/author',
        handler: authorRoute
    },
    {
        path: '/api',
        handler: apiRoute
    },
    {
        path: '/',
        handler: (req,res)=>{
            res.redirect('/explorer')
        }
    }
]

module.exports = app => {
  routes.forEach(r =>{
      if(r.path =='/'){
          app.get(r.path, r.handler)
      }else{
        app.use(r.path, r.handler)
      }
     
  });
}