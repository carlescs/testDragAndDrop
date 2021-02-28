import {Component, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss']
})
export class MainComponentComponent implements OnDestroy {
  public dragging: boolean;

  public files:File[]=[];
  private objects=[];
  public urls:{[index:string]:SafeUrl}={};

  constructor(private sanitizer:DomSanitizer) { }

  public ngOnDestroy(): void {
    this.clear();
  }

  public addFile(file: File): void {
    this.files.push(file);
    let value: string = URL.createObjectURL(file);
    this.objects.push(value);
    this.urls[file.name]=this.sanitizer.bypassSecurityTrustUrl(value);
  }

  public clear(): void {
    this.objects.forEach(o=>URL.revokeObjectURL(o));
    this.objects=[];
    this.files=[];
    this.urls={};
  }

  public addFileNew($event: any): void {
    for(let file of $event.target.files){
      this.addFile(file);
    }
  }

  public fileDialogOpen(): void {
    document.querySelectorAll("input[type=file]").forEach((el:HTMLElement)=>el.click());
  }
}
