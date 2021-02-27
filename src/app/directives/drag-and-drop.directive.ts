import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {

  constructor(private elem:ElementRef) {
    elem.nativeElement.style="background-color: red;"
  }

}
