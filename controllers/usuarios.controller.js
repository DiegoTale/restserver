const { response, request } = require('express');


const usuariosGet = (req = request, res = response) => {

    const query = req.query;

    res.json({
        msg: 'get API - Controlador',
        query
    });
}

const usuariosPost = (req = request, res = response) => {

    const {nombre, edad} = req.body;

    res.status(201).json({
        msg: 'post API - Controlador',
        nombre, 
        edad
    });
}

const usuariosPut = (req = request, res = response) => {

    const { id } = req.params;
    res.status(500).json({
        msg: 'put API - Controlador',
        id
    });
}

const usuariosDelete = (req = request, res = response) => {
    res.json({
        msg: 'delete API - Controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}