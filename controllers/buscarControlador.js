const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const colleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
]

const buscarUsuarios = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // TRUE

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        })
    }

    const regex = new RegExp( termino, 'i' );

    const usuarios = await Usuario.find({ 
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
     });

    res.json({
        results: usuarios
    })
}

const bucarCategorias = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // TRUE

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        })
    }

    const regex = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    })
} 

const buscaProductos = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // TRUE

    if (esMongoID) {
        const producto = await Producto.findById(termino)
                                       .populate('categoria', 'nombre');
        return res.json({
            results: ( producto ) ? [ producto ] : []
        })
    }

    const regex = new RegExp( termino, 'i' );

    const productos = await Producto.find({ nombre: regex, estado: true })
                                    .populate('categoria', 'nombre')

    res.json({
        results: productos
    })
} 

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!colleccionesPermitidas.includes( coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${colleccionesPermitidas}`
        })
    }

    switch( coleccion ) {
        case 'categorias':
            bucarCategorias(termino, res);
        
        break;
        case 'productos':
            buscaProductos(termino, res)

        break;
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        default:
            res.status(500).json({
                msg: 'Se te olvido hacer esta busqueda'
            })
    }
}




module.exports = {
    buscar
}