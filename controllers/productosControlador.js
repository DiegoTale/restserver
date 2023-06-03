const { response } = require('express');
const { Producto } = require('../models');
const { body } = require('express-validator');

// obtenerProductos - paginado - total - populate
const obtenerProductos = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number( desde ))
            .limit(Number(limite))
    ]);

    res.json({
        // resp
        total,
        productos
    });
}

const obtenerProducto = async(req, res = response) => {

    const { id }  = req.params;
    const producto = await Producto.findById(id).populate('usuario', 'nombre')
                                                .populate('usuario', 'nombre');

    res.json(producto)
}

const crearProducto = async(req, res = response) => {

    const { estado, usuario, ...body } = body.nombre;

    const productoDB = await Producto.findOne({nombre});

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = await new Producto(data);
    
    // Guardar DB
    await producto.save();

    res.status(201).json(producto)
    
}

const actualizarProducto = async(req, res = response) => {
    
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre  = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
    res.json(producto);
}


const borrarProducto = async(req, res = response) => {
    
    const { id } = req.params;
    const productoBorrada = await Producto.findByIdAndUpdate(id, {estado: false}, { new: true });

    res.json(productoBorrada);
}





module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}