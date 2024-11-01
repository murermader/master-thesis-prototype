// src/app/shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayerSettingsService {
  private selectedLayerUrl = new BehaviorSubject<any>(null);
  selectedLayer$ = this.selectedLayerUrl.asObservable();

  setLayer(item: any) {
    this.selectedLayerUrl.next(item);
  }
}
