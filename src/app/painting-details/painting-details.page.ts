import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetApiService } from '../services/met-api.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-painting-details',
  templateUrl: './painting-details.page.html',
  styleUrls: ['./painting-details.page.scss'],
})
export class PaintingDetailsPage implements OnInit {
  painting: any;
  comments: any[] = [];
  commentForm: FormGroup;
  errorMessage: string = '';
  showComments: boolean = false;
  showCommentForm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private metApiService: MetApiService,
    private navCtrl: NavController,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]+$/)]],
      comment: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]+$/)]]
    });
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.metApiService.getPaintingDetails(id).subscribe((data: any) => {
      this.painting = data;
      this.fetchComments(id);
    });
  }

  fetchComments(objectID: number) {
    this.metApiService.getComments(objectID).subscribe((response: any) => {
      if (response.error) {
        this.errorMessage = response.message;
      } else if (response.length === 0) {
        this.errorMessage = 'No comments yet!';
      } else {
        this.comments = response;
      }
    });
  }

  postComment() {
    if (this.commentForm.valid) {
      const { name, comment } = this.commentForm.value;
      const objectID = this.painting?.objectID;
      if (objectID) {
        this.metApiService.postComment(objectID, { username: name, comment }).subscribe(() => {
          this.commentForm.reset();
          this.showCommentForm = false; // Hide the form after submission
          this.fetchComments(objectID);
        });
      }
    } else {
      this.errorMessage = 'Please enter a valid username and comment (only letters, at least 2 characters).';
    }
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  toggleCommentForm() {
    this.showCommentForm = !this.showCommentForm;
  }

  goBack() {
    this.navCtrl.back();
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







