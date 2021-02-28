import {Component, OnDestroy} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {DescriptionService} from '../../services/description.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-main-component',
  templateUrl: './main-component.component.html',
  styleUrls: ['./main-component.component.scss']
})
export class MainComponentComponent implements OnDestroy {
  public dragging: boolean;

  public files: { file: File, description?: string }[] = [];
  public urls: { [index: string]: SafeUrl } = {};
  private objects = [];
  private subscriptions: Subscription[] = [];

  constructor(private sanitizer: DomSanitizer, private descriptionService: DescriptionService) {
  }

  public ngOnDestroy(): void {
    this.clear();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public addFile(file: File): void {
    this.files.push({file: file});
    let value: string = URL.createObjectURL(file);
    this.objects.push(value);
    this.urls[file.name] = this.sanitizer.bypassSecurityTrustUrl(value);
  }

  public clear(): void {
    this.objects.forEach(o => URL.revokeObjectURL(o));
    this.objects = [];
    this.files = [];
    this.urls = {};
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
      if (this.isImage(file.file.type))
        this.subscriptions.push(this.descriptionService.getDescription(file.file).subscribe(desc => file.description = desc.Captions[0]));
    }
  }

  public isImage(type: string): boolean {
    return type == 'image/jpeg' || type == 'image/png' || type == 'image/jpg';
  }
}
