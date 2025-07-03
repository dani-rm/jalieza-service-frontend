import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonLabel, IonTitle, IonCard, IonSearchbar,
  IonCardContent, IonAvatar, IonItem, IonSelect, IonSelectOption} from '@ionic/angular/standalone';
import { NavbarComponent } from './../../components/navbar/navbar.component'
import { FooterComponent } from './../../components/footer/footer.component';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-buscar-ciudadano',
  templateUrl: './buscar-ciudadano.page.html',
  styleUrls: ['./buscar-ciudadano.page.scss'],
  standalone: true,
  imports: [IonItem, IonAvatar, IonCardContent, IonSearchbar, IonCard, IonSelect, IonSelectOption,
    IonTitle, IonLabel, IonCol, IonRow, IonGrid, IonContent, CommonModule, FormsModule, NavbarComponent, FooterComponent]
})
export class BuscarCiudadanoPage implements OnInit {
  constructor(private navCtrl: NavController, private usuarioService: UsuarioService) {}

  searchTerm = "";
  selectedFilter = "todos";
  selectedCargo = "todos";
  selectedCandidatoCargo = "todos";

  users: any[] = [];
  filteredUsers: any[] = [];

  ngOnInit() {
    this.users = this.usuarioService.getUsuarios();
    this.filterUsers();
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const search = this.searchTerm.toLowerCase();
      const searchMatch =
        user.nombres.toLowerCase().includes(search) ||
        user.apellidoPaterno.toLowerCase().includes(search) ||
        user.apellidoMaterno.toLowerCase().includes(search);

      const isVisible = user.visible;

      let filterMatch = false;

      switch (this.selectedFilter) {
        case "todos":
          filterMatch = true;
          break;
        case "activo":
          filterMatch = isVisible;
          break;
        case "inactivo":
          filterMatch = !isVisible;
          break;
        case "casado":
          filterMatch = user.estadoCivil === "Casado" && isVisible;
          break;
        case "soltero":
          filterMatch = user.estadoCivil === "Soltero" && isVisible;
          break;
        case "divorciado":
          filterMatch = user.estadoCivil === "Divorciado" && isVisible;
          break;
        case "viudo":
          filterMatch = user.estadoCivil === "Viudo" && isVisible;
          break;
        case "conCargos":
          filterMatch =
            isVisible &&
            (this.selectedCargo === "todos"
              ? !!user.cargo
              : user.cargo === this.selectedCargo);
          break;
        case "sinCargos":
          filterMatch = !user.cargo && isVisible;
          break;
        case "candidato":
          filterMatch =
            isVisible &&
            (this.selectedCandidatoCargo === "todos"
              ? !!user.candidatoACargo
              : user.candidatoACargo === this.selectedCandidatoCargo);
          break;
      }

      return searchMatch && filterMatch;
    });
  }

  verUsuario(user: any) {
    this.usuarioService.setUsuario(user);
    this.navCtrl.navigateForward('/ciudadano');
  }

}
