class Usuarios {

    constructor() {
        // Arreglo de personas conectadas al chat
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {

        let persona = { id, nombre, sala };

        this.personas.push(persona);

        return this.personas;
    }

    getPersona(id) {
        // buscar si la persona está en el arreglo de personas
        let persona = this.personas.filter(persona => persona.id === id)[0];
        return persona;
    }


    getPersonas() {
        return this.personas;
    }


    getPersonasPorSala(sala) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;
    }


    borrarPersona(id) {
        // primero  Obtener a la persona antes de eliminarla
        let personaBorrada = this.getPersona(id);
        // me devuelve todos los que no coinciden, el que existe se elimina
        this.personas = this.personas.filter(persona => persona.id != id);

        return personaBorrada;

    }





}



module.exports = {
    Usuarios
};