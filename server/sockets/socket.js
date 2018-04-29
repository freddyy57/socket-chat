const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();


io.on('connection', (client) => {

    // console.log('Usuario conectado');

    client.on('entrarChat', (usuario, callback) => {

        //  console.log(usuario);

        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y sala son necesarios'
            });
        }

        // conectar usuario a la sala
        client.join(usuario.sala);
        // console.log('sala: ', usuario.sala);

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        // emitir un evento para saber cuando se reconecta la persona
        client.broadcast.to(usuario.sala).emit('listaPersona', usuarios.getPersonasPorSala(usuario.sala));
        // enviar mensaje que alguién se conectó
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${ usuario.nombre } entró al Chat`));


        callback(usuarios.getPersonasPorSala(usuario.sala));

    });


    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id);

        // crear mensaje
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        // enviar mensaje a todos
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);

    });


    client.on('disconnect', () => {
        // si se desconecta borrar al usuario
        let personaBorrada = usuarios.borrarPersona(client.id);
        // emitir cuando el cliente se desconecta
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salió`));
        // emitir un evento para saber cuando se reconecta la persona
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    // mensajes Privados
    client.on('mensajePrivado', data => {
        // obtener a la persona que envía el mensaje
        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });

});