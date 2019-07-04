import { Component, OnInit, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  items: Observable<any[]>;
  ventas = 0;
  mensaje = "";
  fecha:any;
  hora:any;
  time = new Date();
  timer;
  videoplay = false;
  duracionvideo = 0;
  urlvideo = "";
  videoplayer: HTMLVideoElement;
  constructor(private afs:AngularFirestore) {


   }

  ngOnInit() {

    this.fecha = new Date().getTime();
    this.hora = Date.now();
    this.items = this.afs.collectionGroup<any>('dashboard', )
      .valueChanges();
    this.items.subscribe(elements=>{

        this.ventas = elements[0].ventas;
        this.mensaje = elements[0].mensaje;
        if (elements[0].videoplay === -1) {
          this.videoplay = true;
          this.urlvideo = "https://www.themyt.com/video/promo2.mp4";
         this.videoplayer = document.getElementById('video') as HTMLVideoElement;
          console.log(document.getElementById('video'));

          this.videoplayer.play();
          console.log(this.urlvideo);
        }
        else{
          this.videoplay = false;
          this.videoplayer = document.getElementById('video') as HTMLVideoElement;
          this.videoplayer.pause();
        }
      });

    this.timer = setInterval(() => {
      this.time = new Date();
    }, 1000);
  }
  ngOnDestroy(){
    clearInterval(this.timer);
  }
}
