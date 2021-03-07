import {SafeUrl} from '@angular/platform-browser';

export class Description{
  tags:string[];
  captions:string[];
}

export type AddedFile = {
    descriptionLoading: Boolean;
    file: File,
    description?: string,
    progress: number,
    objectUrl?: string,
    safeUrl?: SafeUrl
};
