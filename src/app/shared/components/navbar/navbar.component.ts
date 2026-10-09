import { AuthService } from './../../../core/auth/services/auth.service';
import { Component, inject, Input } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbit.service';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input({ required: true }) isLogin!: boolean;

  constructor(private flowbiteService: FlowbiteService) {}

  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
  sigOut(): void {
    this.authService.logOut();
  }
}
