import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MhdIconComponent} from './mhd-icon/mhd-icon.component';
import {MhdLogoComponent} from "./mhd-logo/mhd-logo.component";
import { MhdPillSelectComponent } from './mhd-pill-select/mhd-pill-select.component';

@NgModule({
  imports: [CommonModule, MhdIconComponent, MhdLogoComponent, MhdPillSelectComponent],
  exports: [MhdIconComponent, MhdIconComponent, MhdPillSelectComponent],
})
export class MhDesignModule {
}
