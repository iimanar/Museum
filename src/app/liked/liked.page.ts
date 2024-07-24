import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-liked',
  templateUrl: './liked.page.html',
  styleUrls: ['./liked.page.scss'],
})
export class LikedPage implements OnInit {
  likedPaintings: any[] = [];

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    this.loadLikedPaintings();
  }

  ionViewWillEnter() {
    this.loadLikedPaintings();
  }

  loadLikedPaintings() {
    this.likedPaintings = JSON.parse(localStorage.getItem('likedPaintings') || '[]');
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
    this.loadLikedPaintings(); // Refresh the liked paintings list
  }

  isLiked(painting: any): boolean {
    let likedPaintings = JSON.parse(localStorage.getItem('likedPaintings') || '[]');
    return likedPaintings.some((p: any) => p.objectID === painting.objectID);
  }
}
