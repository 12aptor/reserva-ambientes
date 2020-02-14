const {Reserva, Ambiente, Pabellon, Usuario} = require('../config/Sequelize');
const {Op} = require('sequelize');

const postReserva = (req, res)=>{
    let {objReserva} = req.body;
    // antes de crear la reserva ver si esta disponible ese ambiente y ver si el tipo de usuario que autoriza
    // es de tipo 3 sino no me deja guardar
    Usuario.findOne({
        where:{
            usu_id: objReserva.usu_autoriza
        }
    }).then(usu_autoriza=>{
        if(usu_autoriza.usu_tipo===3){
            Reserva.findAll({
                where:{
                    amb_id: objReserva.amb_id,
                    [Op.or]:[{
                        res_fechin: {[Op.between]:[objReserva.res_fechin, objReserva.res_fechfin]}
                    },{
                        res_fechfin: {[Op.between]:[objReserva.res_fechin, objReserva.res_fechfin]}
                    }]
                }
            }).then(reservas =>{
                if(reservas.length === 0){
                    Reserva.build(objReserva).save().then(reservaGenerada=>{
                        res.status(201).json({
                            ok: true,
                            contenido: reservaGenerada,
                            mensaje: 'Reserva generada exitosamente'
                        })
                    })
                }else{
                    res.status(400).json({
                        ok: false,
                        mensaje: 'Ese ambiente ya se encuentra reservado en esas fechas'
                    })
                }
            })
        }else{
            res.status(401).json({
                ok: false,
                mensaje: 'El usuario no dispone de privilegios suficientes para reservar el aula'
            })
        }
    })
}
const validarReserva = (req, res)=>{
    // LE mandas las fechas de reserva y el ambiente y ver si esta disponible o no
    // findAll => arreglo de todas las coincidencias y el findOne te devuelve la primera coincidencia
    let {fecha_inicio, fecha_fin, ambiente} = req.params;
    Reserva.findAll({
        include:[{
            model: Pabellon
        }],
        where:{
            amb_id: ambiente,
            [Op.or]:[{
                res_fechin: {
                    [Op.between]:[fecha_inicio,fecha_fin]
                }
            },{
                res_fechfin:{
                    [Op.between]:[fecha_inicio,fecha_fin]
                }
            }]
        }
    }).then(reservas=>{
        if (reservas){
            res.status(200).json({
                ok: true,
                mensaje: 'Ya hay una reserva en esa fecha'
            })
        }else{
            res.status(200).json({
                ok: true,
                mensaje: 'El ambiente se encuentra libre a esas horas',
                contenido: reservas
            })
        }
    })
}
const getReservaByFechas = (req, res)=>{
    let {fecha_inicio, fecha_fin} = req.params;
    Reserva.findAll({
        include:[{
            model: Ambiente
        }],
        where:{
            [Op.or]:[{
                res_fechin: {
                    [Op.between]:[fecha_inicio,fecha_fin]
                }
            },{
                res_fechfin:{
                    [Op.between]:[fecha_inicio,fecha_fin]
                }
            }]
        }
    }).then(reservas=>{
        if (reservas.length!=0){
            res.status(200).json({
                ok: true,
                mensaje: 'Ya hay una reserva en esa fecha'
            })
        }else{
            res.status(200).json({
                ok: true,
                mensaje: 'El ambiente se encuentra libre a esas horas',
                contenido: reservas
            })
        }
    })
}

module.exports = {
    postReserva,
    validarReserva,
    getReservaByFechas
}