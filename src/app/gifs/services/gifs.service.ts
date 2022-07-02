import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  //API
  private apiKey: string = 'ZLylQvWp5CtS1fRwnS3BJd1K3y4vAw3D';
  //HttpParams
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  // listado para almacenar los strings q vamos introduciendo en el input
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {

    return [...this._historial]; //operador spread para romper la referencia
  }

  constructor(private http: HttpClient) {

    // Ete condicional es para que las búsquedas que se guardan en el localStorage
    //aparezca en nuestra app
    // if (localStorage.getItem('historial')) {
    //   this._historial = JSON.parse( localStorage.getItem('historial')! );
    // }
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];

    //Para que al recargar la pag no se pierdan las imágenes resultantes de la búsqueda
    this.resultados = JSON.parse(localStorage.getItem('images')!) || [];
  }

  //insertar valores a ese nuevo historial    
  buscarGifs(query: string) {

    query = query.trim().toLowerCase();
    // el if es x si no incluye la busqueda entonces es cuando la insertamos
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
    }
    this._historial = this._historial.splice(0, 10); //limitar el num de búsqudas mostradas a 10

    localStorage.setItem('historial', JSON.stringify(this._historial));

    //  console.log(this._historial);
    //Para que la url de la API se vea mejor(HttpParams)
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('imit', '10')
      .set('q', query);

    //  console.log(params.toString());  
    //LLamada HTTP a la API de Giphy
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params: params })
      .subscribe((resp) => {
        // console.log(resp.data);
        this.resultados = resp.data;
        //Para que al recargar la pag no se pierdan las imágenes resultantes de la búsqueda
        localStorage.setItem('images', JSON.stringify(this.resultados));
      });
    //Llamada por fetch a la API de Giphy
    // fetch('https://api.giphy.com/v1/gifs/search?api_key=ZLylQvWp5CtS1fRwnS3BJd1K3y4vAw3D&q=dragon ball z&limit=10')
    //   .then( resp => {
    //     resp.json().then(data => {
    //       console.log(data);
    //     })
    //   })
  }
}
