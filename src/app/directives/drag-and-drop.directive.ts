import {Directive, ElementRef, EventEmitter, Output} from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {

  @Output()
  public dragging: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public fileAdded:EventEmitter<File>=new EventEmitter<File>();

  constructor(private elem: ElementRef) {
    elem.nativeElement.ondrop = this.onDrop;
    elem.nativeElement.ondragover = this.onDragOver;

    elem.nativeElement.ondragenter = this.onDragEnter;

    elem.nativeElement.ondragleave = this.onDragLeave;
    elem.nativeElement.ondragend = this.onDragLeave;
  }

  private onDragLeave = () => {
    this.dragging.emit(false);
  };

  private onDragEnter = () => {
    this.dragging.emit(true);
  };

  private onDrop = ev => {
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          var file = ev.dataTransfer.items[i].getAsFile();
          this.fileAdded.emit(file);
          console.log('... file[' + i + '].name = ' + file.name + ', size=' + file.size);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name + ', size=' + ev.dataTransfer.files[i].size);
        this.fileAdded.emit(ev.dataTransfer.files[i]);
      }
    }
    this.onDragLeave();
  };

  private onDragOver = ev => {
    ev.preventDefault();
    this.onDragEnter();
  };
}
