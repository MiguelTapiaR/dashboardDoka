import { Component, OnInit, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  items: Observable<any[]>;
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
   }

  ngOnInit() {
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
        this.videoplayer = document.getElementById('video') as HTMLVideoElement;
        if (elements[0].videoplay === -1) {
          this.videoplay = true;
         this.videoplayer.src = elements[0].video;
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
  getVideo(): string {
    return this.urlvideo;
  }

  playVideo(player: HTMLVideoElement){
    //this.videoplayer.play();
    this.videoplay = true;
    this.blurClass = 'blur';
    const playPromise = player.play();
    if(playPromise !== null){
      playPromise.catch(()=>{player.play();});
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

}
