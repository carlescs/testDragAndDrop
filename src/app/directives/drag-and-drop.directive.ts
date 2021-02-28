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
      for (let item of ev.dataTransfer.items) {
        // If dropped items aren't files, reject them
        if (item.kind === 'file') {
          let file = item.getAsFile();
          this.fileAdded.emit(file);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let file of ev.dataTransfer.files) {
        this.fileAdded.emit(file);
      }
    }
    this.onDragLeave();
  };

  private onDragOver = ev => {
    ev.preventDefault();
    this.onDragEnter();
  };
}
