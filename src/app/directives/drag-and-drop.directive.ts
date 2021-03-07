import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

interface doDragEnter {
  onDragEnter(evt: DragEvent): void;
}

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective implements doDragEnter {

  @Output()
  public onDragging: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public onFileAdded: EventEmitter<File> = new EventEmitter<File>();

  @HostBinding('class.dragging')
   public dragging:boolean;

  @HostListener('dragleave', ['$event'])
  @HostListener('dragend', ['$event'])
  public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.setDragging(false);
  };

  private setDragging(value: boolean): void {
    this.onDragging.emit(value);
    this.dragging = value;
  }

  @HostListener('dragenter', ['$event'])
  public onDragEnter(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.setDragging(true)
  };

  @HostListener('drop', ['$event'])
  private onDrop(ev: DragEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        let item = ev.dataTransfer.items[i];
        // If dropped items aren't files, reject them
        if (item.kind === 'file') {
          let file = item.getAsFile();
          this.onFileAdded.emit(file);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        let file = ev.dataTransfer.files[i];
        this.onFileAdded.emit(file);
      }
    }
    this.setDragging(false);
  };

  @HostListener('dragover',['$event'])
  private onDragOver(ev:DragEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this.setDragging(true);
  };
}
