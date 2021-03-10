import {Component, OnDestroy} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DescriptionService} from '../../services/description.service';
import {Subscription} from 'rxjs';
import {HttpEventType} from '@angular/common/http';

import {AddedFile} from '../../models/description.models';
import {remove} from 'lodash-es';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss']
})
export class MainComponentComponent implements OnDestroy {


  public files: AddedFile[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private sanitizer: DomSanitizer, private descriptionService: DescriptionService) {
  }

  public ngOnDestroy(): void {
    this.clear();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public addFile(file: File): void {
    let value: string = URL.createObjectURL(file);
    this.files.push({file: file, descriptionLoading: false, progress:0,objectUrl: value, safeUrl:this.sanitizer.bypassSecurityTrustUrl(value)});
  }

  public clear(): void {
    this.files.forEach(o => URL.revokeObjectURL(o.objectUrl));
    this.files = [];
  }

  public addFileNew($event: any): void {
    for (let file of $event.target.files) {
      this.addFile(file);
    }
  }

  public fileDialogOpen(): void {
    document.querySelectorAll("input[type=file]").forEach((el: HTMLElement) => el.click());
  }

  public analyze(): void {
    for (let file of this.files) {
      if (this.isImage(file.file.type) && file.description == null) {
        file.descriptionLoading = true;
        this.subscriptions.push(this.descriptionService.getDescription(file.file)
          .subscribe(event => {
            if (event.type == HttpEventType.Response) {
              file.description = event.body.captions[0];
              file.descriptionLoading = false;
            } else if (event.type == HttpEventType.UploadProgress) {
              file.progress = Math.round(100 * event.loaded / event.total);
            }
          }, e => {
            file.descriptionLoading = false;
          }));
      }
    }
  }

  public isImage(type: string): boolean {
    return type == 'image/jpeg' || type == 'image/png' || type == 'image/jpg';
  }

  public deleteItem(file:AddedFile) {
    URL.revokeObjectURL(file.objectUrl);
    remove(this.files,f=>file.file==f.file);
  }
}
