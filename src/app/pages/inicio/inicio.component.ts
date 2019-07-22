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
  mensaje = '';
  fecha: any;
  hora: any;
  time = new Date();
  timer;
  videoplay = false;
  duracionvideo = 0;
  urlvideo = '';
  videoplayer: HTMLVideoElement;

  blurClass="";
  constructor(private afs: AngularFirestore) {
    

   }

  ngOnInit() {

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

}
