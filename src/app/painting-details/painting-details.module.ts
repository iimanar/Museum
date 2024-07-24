import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

import { IonicModule } from '@ionic/angular';

import { PaintingDetailsPageRoutingModule } from './painting-details-routing.module';

import { PaintingDetailsPage } from './painting-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Add ReactiveFormsModule here
    IonicModule,
    PaintingDetailsPageRoutingModule
  ],
  declarations: [PaintingDetailsPage]
})
export class PaintingDetailsPageModule {}
