import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBarComponent {}
