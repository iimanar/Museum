import { Component, OnInit } from '@angular/core';
import { MetApiService } from '../services/met-api.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  paintings: any[] = [];

  constructor(private metApiService: MetApiService, private navCtrl: NavController) {}

  ngOnInit() {
    this.metApiService.searchPaintings('painting').subscribe((response: any) => {
      if (response.objectIDs) {
        response.objectIDs.slice(1, 15).forEach((objectID: number) => {
          this.metApiService.getPaintingDetails(objectID).subscribe((details: any) => {
            if (details.primaryImage) { 
              details.artistDisplayName = details.artistDisplayName || 'UNKNOWN'; // Default artistDisplayName to 'UNKNOWN'
              this.paintings.push(details);
            }
          });
        });
      }
    });
  }

  openDetails(painting: any) {
    this.navCtrl.navigateForward(`/painting-details/${painting.objectID}`);
  }

  likePainting(painting: any, event: Event) {
    event.stopPropagation();
    let likedPaintings = JSON.parse(localStorage.getItem('likedPaintings') || '[]');
    
    const index = likedPaintings.findIndex((p: any) => p.objectID === painting.objectID);
    
    if (index > -1) {
      likedPaintings.splice(index, 1); // Remove painting if already liked
    } else {
      likedPaintings.push(painting); // Add painting if not already liked
    }
    
    localStorage.setItem('likedPaintings', JSON.stringify(likedPaintings));
  }

  isLiked(painting: any): boolean {
    let likedPaintings = JSON.parse(localStorage.getItem('likedPaintings') || '[]');
    return likedPaintings.some((p: any) => p.objectID === painting.objectID);
  }
}
