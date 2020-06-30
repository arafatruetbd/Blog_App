const router =require('express').Router()

const { searchresultGetcontroller } = require('../controllers/searchController')

router.get('/',searchresultGetcontroller)

module.exports = router