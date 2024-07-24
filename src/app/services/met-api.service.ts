import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MetApiService {
  private baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/';
  private commentsUrl = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/pKSoTbGzFhj5RtoeFQif/comments';

  constructor(private http: HttpClient) {}

  searchPaintings(query: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}search?&q=${query}`);
  }

  getPaintingDetails(objectID: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}objects/${objectID}`);
  }

  getComments(objectID: number): Observable<any> {
    return this.http.get<any>(`${this.commentsUrl}?item_id=${objectID}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of([]); // Return an empty array if no comments found
        } else {
          return of({ error: true, message: 'No comments found' });
        }
      })
    );
  }

  postComment(objectID: number, comment: any): Observable<any> {
    return this.http.post<any>(this.commentsUrl, {
      item_id: objectID,
      username: comment.username,
      comment: comment.comment,
      timestamp: new Date().toISOString() // Add timestamp here
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({ error: true, message: error.message });
      })
    );
  }
}
