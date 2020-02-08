const Ambientes = require ('../controleadores/Ambiente')
const express = require ('express');
const ambiente_router = express.Router();
const {wachiman} = require('../utils/utils');

ambiente_router.get('/ambiente', Ambientes.getAmbientes);
ambiente_router.post('/ambiente', Ambientes.postAmbientes);
ambiente_router.put('/ambiente/:id_ambiente', Ambientes.putAmbientes);

module.exports={
    ambiente_router
}