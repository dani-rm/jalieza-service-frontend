import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonGrid, IonRow, IonCol, IonLabel, IonInput, IonTitle,
  IonToolbar, IonHeader, IonCard, IonSearchbar, IonCardContent, IonAvatar, IonItem, IonSelect,
  IonSelectOption} from '@ionic/angular/standalone';
import { NavbarComponent } from './../../components/navbar/navbar.component'
import { FooterComponent } from './../../components/footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-buscar-ciudadano',
  templateUrl: './buscar-ciudadano.page.html',
  styleUrls: ['./buscar-ciudadano.page.scss'],
  standalone: true,
  imports: [IonItem, IonAvatar, IonCardContent, IonSearchbar, IonCard, IonSelect, IonSelectOption,
    IonTitle, IonLabel, IonCol, IonRow, IonGrid, IonButton, IonContent, CommonModule, IonToolbar,
    FormsModule, NavbarComponent, FooterComponent]
})
export class BuscarCiudadanoPage implements OnInit {
  searchTerm = "";
  selectedFilter = "todos";
  selectedCargo = "";

  users = [
    { nombre: "Alexis Pérez", estadoCivil: "casado", visible: true, cargo: "" },
    { nombre: "María González", estadoCivil: "soltero", visible: true, cargo: "diputado" },
    { nombre: "Juan López", estadoCivil: "casado", visible: false, cargo: "senador" },
    { nombre: "Ana Torres", estadoCivil: "soltero", visible: true, cargo: "" },
    { nombre: "Luis Martínez", estadoCivil: "casado", visible: true, cargo: "alcalde" },
    { nombre: "Carla Sánchez", estadoCivil: "soltero", visible: false, cargo: "" },
    { nombre: "Pedro Ramírez", estadoCivil: "casado", visible: true, cargo: "gobernador" },
    { nombre: "Laura Díaz", estadoCivil: "soltero", visible: true, cargo: "" },
    { nombre: "Javier Fernández", estadoCivil: "casado", visible: true, cargo: "diputado" },
    { nombre: "Sofía Herrera", estadoCivil: "soltero", visible: false, cargo: "" }
  ];

  filteredUsers = this.users.filter(user => user.visible);

  filterUsers() {
  this.filteredUsers = this.users.filter(user => {
    const searchMatch = user.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
    const filterMatch =
      (this.selectedFilter === "todos" && user.visible) ||
      (this.selectedFilter === "casado" && user.estadoCivil === "casado" && user.visible) ||
      (this.selectedFilter === "soltero" && user.estadoCivil === "soltero" && user.visible) ||
      (this.selectedFilter === "borrado" && !user.visible) || // Solo muestra los no visibles
      (this.selectedFilter === "conCargos" && user.cargo && user.visible) ||
      (this.selectedFilter === "sinCargos" && !user.cargo && user.visible) ||
      (this.selectedFilter === "candidato" && user.cargo === this.selectedCargo && user.visible);

    return searchMatch && filterMatch;
  });
}

  constructor() { }

  ngOnInit() {
  }

}
