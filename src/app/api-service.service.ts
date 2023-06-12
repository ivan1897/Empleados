import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://127.0.0.1:8000/api/mantenimientos'; 

  constructor(private http: HttpClient) { }
  

  obtenerDatos(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  crearDato(datos: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, datos).pipe(
      catchError(this.handleError)
    );
  }

  actualizarDato(id: number, datos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, datos).pipe(
      catchError(this.handleError)
    );
  }

  eliminarDato(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  
  private handleError(error: any): Observable<any> {
    console.error('Ocurrió un error:', error);
    throw error;
  }
}
