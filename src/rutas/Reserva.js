const Reservas = require ('../controleadores/Reserva');
const express = require('express');
const reserva_router = express.Router();
const {wachiman} = require('../utils/utils')

reserva_router.post('/reservar',wachiman, Reservas.postReserva);
reserva_router.get('/reservas/:fecha_inicio/:fecha_fin', Reservas.getReservaByFechas);
reserva_router.get('/reserva', Reservas.getReservas);
reserva_router.get('/reserva/:fecha_inicio/:fecha_fin/:ambiente',Reservas.validarReserva);

module.exports = {
    reserva_router
}