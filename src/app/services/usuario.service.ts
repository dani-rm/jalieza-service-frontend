import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarios = [
    {
      nombres: "Alexis Edmundo", apellidoPaterno: "Méndez", apellidoMaterno: "Gallegos",
      estadoCivil: "Soltero", telefono: "9512204716", fechaNacimiento: "10-10-2005",
      visible: true, cargo: "", candidatoACargo: "Diputado", pareja: ""
    },
    {
      nombres: "María del Carmen", apellidoPaterno: "García", apellidoMaterno: "López",
      estadoCivil: "Casado", telefono: "9511234567", fechaNacimiento: "15-05-1990",
      visible: true, cargo: "Alcalde", candidatoACargo: "", pareja: "Juan Pérez Santillo"
    },
    {
      nombres: "José Luis", apellidoPaterno: "Hernández", apellidoMaterno: "Martínez",
      estadoCivil: "Divorciado", telefono: "9519876543", fechaNacimiento: "20-08-1985",
      visible: true, cargo: "", candidatoACargo: "Senador", pareja: "María del Carmen García López"
    },
    {
      nombres: "Ana María", apellidoPaterno: "Sánchez", apellidoMaterno: "Ramírez",
      estadoCivil: "Viudo", telefono: "9514567890", fechaNacimiento: "30-12-1975",
      visible: true, cargo: "", candidatoACargo: "Gobernador", pareja: "Carlos Alberto Torres Gómez"
    },
    {
      nombres: "Carlos Alberto", apellidoPaterno: "Torres", apellidoMaterno: "Gómez",
      estadoCivil: "Soltero", telefono: "9513216548", fechaNacimiento: "05-03-2000",
      visible: false, cargo: "", candidatoACargo: "", pareja: ""
    },
    {
      nombres: "Laura Isabel", apellidoPaterno: "Pérez", apellidoMaterno: "Fernández",
      estadoCivil: "Casado", telefono: "9517894561", fechaNacimiento: "25-11-1988",
      visible: true, cargo: "", candidatoACargo: "Diputado", pareja: "Roberto Carlos García Hernández"
    },
    {
      nombres: "Miguel Ángel", apellidoPaterno: "Ramírez", apellidoMaterno: "Gutiérrez",
      estadoCivil: "Divorciado", telefono: "9516547892", fechaNacimiento: "18-07-1980",
      visible: true, cargo: "Senador", candidatoACargo: "", pareja: "Patricia Elena Rojas Mendoza"
    },
    {
      nombres: "Sofía Elena", apellidoPaterno: "Morales", apellidoMaterno: "Cruz",
      estadoCivil: "Viudo", telefono: "9518529637", fechaNacimiento: "12-09-1970",
      visible: true, cargo: "", candidatoACargo: "", pareja: "Diego Alejandro Ramírez Cruz"
    },
    {
      nombres: "David Alejandro", apellidoPaterno: "Vázquez", apellidoMaterno: "Ríos",
      estadoCivil: "Soltero", telefono: "9519638520", fechaNacimiento: "22-04-2003",
      visible: false, cargo: "", candidatoACargo: "", pareja: ""
    },
    {
      nombres: "Isabel Cristina", apellidoPaterno: "Gómez", apellidoMaterno: "Lara",
      estadoCivil: "Casado", telefono: "9517412589", fechaNacimiento: "28-06-1995",
      visible: true, cargo: "Diputado", candidatoACargo: "", pareja: "Luis Ricardo Lara Soto"
    },
    {
      nombres: "Fernando Javier", apellidoPaterno: "Cordero", apellidoMaterno: "Salazar",
      estadoCivil: "Divorciado", telefono: "9518521473", fechaNacimiento: "10-01-1982",
      visible: true, cargo: "", candidatoACargo: "Gobernador", pareja: "Claudia Patricia Salazar Ruiz"
    },
    {
      nombres: "Patricia Elena", apellidoPaterno: "Rojas", apellidoMaterno: "Mendoza",
      estadoCivil: "Viudo", telefono: "9513692580", fechaNacimiento: "15-02-1978",
      visible: true, cargo: "", candidatoACargo: "", pareja: "Miguel Ángel Ramírez Gutiérrez"
    },
    {
      nombres: "Roberto Carlos", apellidoPaterno: "García", apellidoMaterno: "Hernández",
      estadoCivil: "Soltero", telefono: "9512589634", fechaNacimiento: "08-11-2001",
      visible: false, cargo: "", candidatoACargo: "", pareja: ""
    },
    {
      nombres: "Lucía Fernanda", apellidoPaterno: "Martínez", apellidoMaterno: "Soto",
      estadoCivil: "Casado", telefono: "9511472583", fechaNacimiento: "20-09-1992",
      visible: true, cargo: "Gobernador", candidatoACargo: "", pareja: "Andrés Eduardo Soto Ramírez"
    },
    {
      nombres: "Javier Alejandro", apellidoPaterno: "López", apellidoMaterno: "Pérez",
      estadoCivil: "Divorciado", telefono: "9513691478", fechaNacimiento: "30-03-1987",
      visible: true, cargo: "", candidatoACargo: "", pareja: "Ana María Pérez Fernández"
    },
    {
      nombres: "Carolina Isabel", apellidoPaterno: "Gutiérrez", apellidoMaterno: "Vargas",
      estadoCivil: "Viudo", telefono: "9517891234", fechaNacimiento: "05-08-1973",
      visible: true, cargo: "", candidatoACargo: "Alcalde", pareja: "Eduardo Andrés Vargas Ruiz"
    },
    {
      nombres: "Diego Alejandro", apellidoPaterno: "Ramírez", apellidoMaterno: "Cruz",
      estadoCivil: "Soltero", telefono: "9514567893", fechaNacimiento: "12-06-2004",
      visible: false, cargo: "", candidatoACargo: "", pareja: ""
    },
    {
      nombres: "Valentina Sofía", apellidoPaterno: "Morales", apellidoMaterno: "López",
      estadoCivil: "Casado", telefono: "9513216549", fechaNacimiento: "18-10-1990",
      visible: true, cargo: "", candidatoACargo: "", pareja: "Carlos Enrique López Delgado"
    }
  ];

  private usuarioSeleccionado: any;

  constructor() {}

  getUsuarios() {
    return this.usuarios;
  }

  setUsuario(usuario: any) {
    this.usuarioSeleccionado = usuario;
    localStorage.setItem('usuarioSeleccionado', JSON.stringify(usuario));
  }

  getUsuario() {
    if (!this.usuarioSeleccionado) {
      const usuarioGuardado = localStorage.getItem('usuarioSeleccionado');
      if (usuarioGuardado) {
        this.usuarioSeleccionado = JSON.parse(usuarioGuardado);
      }
    }
    return this.usuarioSeleccionado;
  }

}
