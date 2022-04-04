import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DiaryEffects } from './+state/diary.effects';
import { diaryFeature } from './+state/diary.reducer';
import {
  DiariesComponent,
  DiariesComponentModule,
} from './diaries/diaries.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DiariesComponent,
      },
    ]),
    DiariesComponentModule,
    StoreModule.forFeature(diaryFeature),
    EffectsModule.forFeature([DiaryEffects]),
  ],
})
export class DiaryFeatureModule {}
