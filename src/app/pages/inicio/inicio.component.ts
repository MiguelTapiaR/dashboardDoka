import { Component, OnInit, ElementRef } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { element } from 'protractor';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Cobradores>;
  itemsCobradores: Observable<Cobradores[]>;

  private itemsCollectionVen: AngularFirestoreCollection<Cobradores>;
  itemsVendedores: Observable<Cobradores[]>;

  items: Observable<any[]>;
  pantallaObs: Observable<any[]>;
  ventas = 0;
  mensaje = '';
  fecha: any;
  hora: any;
  time = new Date();
  timer;
  videoplay = false;
  duracionvideo = 0;
  urlvideo = '';
  videoplayer: HTMLVideoElement;
  private appId: string;
  private appCode: string;
  pantalla2 = 0;

  public weather: any;

  public climaHoy: Clima;
  public climaDos: Clima;
  public climaTres: Clima;
  public climaCuatro: Clima;
  blurClass = '';


  constructor(private afs: AngularFirestore, private http: HttpClient) {

    this.appId = 'vdhTFADLJqQqnM351sop';
    this.appCode = 'l5HgBh54ZJ6YNxLKFgGtmQ';
    this.weather = [];

    this.climaHoy = {descripcion: '',
                      dia: 0,
                      imagen: '',
                      temperatura: ''};

    this.climaDos = {descripcion: '',
                      dia: 0,
                      imagen: '',
                      temperatura: ''};

    this.climaTres = {descripcion: '',
                      dia: 0,
                      imagen: '',
                      temperatura: ''};

    this.climaCuatro = {descripcion: '',
                      dia: 0,
                      imagen: '',
                      temperatura: ''};




   }


  ngOnInit() {
    this.getPantalla();
    this.getInfo();
    this.videoplayer = document.getElementById('video') as HTMLVideoElement;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.getWeather(position.coords);
      });
    } else {
      console.error('The browser does not support geolocation...');
    }
    this.fecha = new Date().getTime();
    this.hora = Date.now();
    this.items = this.afs.collectionGroup<any>('dashboard', )
      .valueChanges();
    this.items.subscribe(elements => {

        this.ventas = elements[0].ventas;
        this.mensaje = elements[0].mensaje;
        this.urlvideo = elements[0].video;

        if (elements[0].videoplay === -1) {
          this.videoplay = true;
          //this.videoplayer.src = elements[0].video;
          console.log(document.getElementById('video'));
          this.videoplayer.load();
          this.playVideo(this.videoplayer);
          //this.videoplayer.play();
          console.log(this.urlvideo);
        } else {
          this.videoplay = false;
          this.blurClass = '';
          this.videoplayer.pause();
        }
      });

    this.timer = setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  playVideo(player: HTMLVideoElement) {


    console.log(player.duration);
    this.videoplay = true;
    this.blurClass = 'blur';
    const playPromise = player.play();
    if (playPromise !== null) {
      playPromise.catch(() => {player.play();
      player.muted = false;});
    }
  }

  public getWeather(coordinates: any) {
    // tslint:disable-next-line: max-line-length
    this.http.jsonp('https://weather.cit.api.here.com/weather/1.0/report.json?product=forecast_7days_simple&latitude=' + coordinates.latitude + "&longitude=" + coordinates.longitude + "&app_id=" + this.appId + "&app_code=" + this.appCode, "jsonpCallback")
      .pipe(map(result => (<any>result).dailyForecasts.forecastLocation))
      .subscribe(result => {

        this.climaHoy = {
          descripcion:  result.forecast[0].description,
          imagen: result.forecast[0].iconLink,
          temperatura: result.forecast[0].highTemperature,
          dia: result.forecast[0].utcTime
        };
        this.climaDos = {
          descripcion:  result.forecast[1].description,
          imagen: result.forecast[1].iconLink,
          temperatura: result.forecast[1].highTemperature,
          dia: result.forecast[1].utcTime
        };
        this.climaTres = {
          descripcion:  result.forecast[2].description,
          imagen: result.forecast[2].iconLink,
          temperatura: result.forecast[2].highTemperature,
          dia: result.forecast[2].utcTime
        };
        this.climaCuatro = {
          descripcion:  result.forecast[3].description,
          imagen: result.forecast[3].iconLink,
          temperatura: result.forecast[3].highTemperature,
          dia: result.forecast[3].utcTime
        };
        

      }, error => {
        console.error(error);
      });
  }
  getDuration(e) {
    this.duracionvideo = e.target.duration + 1;
    console.log(this.duracionvideo);
  }
  getPantalla() {
    this.pantallaObs = this.afs.collectionGroup<any>('pantallaSeleccionadaDashboard' )
    .valueChanges();
    this.pantallaObs.subscribe(elements => {
    console.log(elements);
    this.pantalla2 = elements[0].idPantalla;
  });
  }

   getInfo() {



    this.itemsCollection = this.afs.collection<Cobradores>('cobradores', ref => ref.orderBy('cantidad', 'desc'));
    // .snapshotChanges() returns a DocumentChangeAction[], which contains
    // a lot of information about "what happened" with each change. If you want to
    // get the data and the id use the map operator.
    this.itemsCobradores = this.itemsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Cobradores;
        const id = a.payload.doc.id;
        console.log(id);
        return { id, ...data };
      }))
    );



    this.itemsCollectionVen = this.afs.collection<Cobradores>('vendedores', ref => ref.orderBy('cantidad'));
    // .snapshotChanges() returns a DocumentChangeAction[], which contains
    // a lot of information about "what happened" with each change. If you want to
    // get the data and the id use the map operator.
    this.itemsVendedores = this.itemsCollectionVen.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Cobradores;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );

  }
}
