const { Pabellon, Ambiente, Reserva } = require('./../config/Sequelize');
// Con el objeto Pabellon, se accederá a la base de datos
// en la tabla t_pabellon
const { Op } = require('sequelize');

const getPabellones = (req, res) => {
  // Select * FROM t_pabellon
  Pabellon.findAll({
    include: [{
      model:Ambiente
    }]
  }).then((pabellones) => {
    res.json({
      ok: true,
      contenido: pabellones
    })
  });
}

const postPabellon = (req, res) => {
  let objPabellon = req.body.objPabellon;
  // Forma 1, Creando primero la instancia de un Pabellon
  // Para guardarlo en la BD posteriormente
  let objPab = Pabellon.build(objPabellon);
  objPab.save().then((pabellonCreado) => {
    res.status(201).json({
      ok: true,
      contenido: pabellonCreado,
      mensaje: 'El pabellon ha sido creado con exito'
    })
  })

}

const postPabellonConCreate = (req, res) => {
  let { objPabellon } = req.body;
  // Forma 2, Crear y guardar una instancia de un Pabellon en un 
  // solo paso

  // Si no se le pones stado a tu respuesta automaticamente es el numero 200
  // el send se usa para enviar una cadena de texto
  // res.status(200).send('Ok)

  Pabellon.create(objPabellon).then((pabellonCreado) => {
    res.status(201).json({
      ok: true,
      contenido: pabellonCreado,
      mensaje: 'El pabellon ha sido creado con exito'
    })
  })

}

const putPabellon = (req, res) => {
  let { id_pabellon } = req.params;
  let { objPabellon } = req.body;
  // findAll, findOne, findByPk
  Pabellon.findByPk(id_pabellon).then((pabellon) => {
    if (pabellon) {
      // anidamiento de promesas
      return Pabellon.update(objPabellon, {
        where: { pab_id: id_pabellon }
      })
    } else {
      res.status(404).json({
        ok: false,
        contenido: null,
        mensaje: 'No se encontro ese pabellon'
      })
    }
  }).then(pabellonActualizado => {
    res.status(200).json({
      ok: true,
      contenido: pabellonActualizado,
      mensaje: 'El pabellon se actualizo correctamente'
    })
  })
}
const getPabellonLike = (req, res) => {
  let { palabra } = req.params;
  console.log(palabra);
  // select * from pabellon where
  Pabellon.findAll({
      where: {
        pab_nom:{
        [Op.like]: '%' + palabra + '%'
        }
      } 
    }).then(pabellones => {
    res.json({
      ok: true,
      contenido: pabellones
    })
  });

}
const getAmbientesByPabellon=(req,res)=>{
  let {id_pabellon}=req.params;
  Pabellon.findByPk(id_pabellon,{
      attributes:[],
      include:[{
          model: Ambiente
      }]
  }).then(pabellon=>{
      res.status(200).json({
          ok: true,
          contenido: pabellon
      })
  })
}

const getReservaByPabellon = (req, res)=>{
  let {id_pabellon} =req.params;
  Pabellon.findByPk(id_pabellon,{
    include:[{
      model: Ambiente,
      include: [{
        model:Reserva
      }]
    }]
  }).then(reservas=>{
    res.status(200).json({
      ok: true,
      contenido: reservas
    })
  })
}


module.exports = {
  getPabellones: getPabellones,
  postPabellon: postPabellon,
  // por ms6 podemos poner defrente postPabellonConCreate nada mas y seria la llave y la ruta a la vez
  postPabellonConCreate: postPabellonConCreate,
  putPabellon,
  getPabellonLike,
  getAmbientesByPabellon,
  getReservaByPabellon
}