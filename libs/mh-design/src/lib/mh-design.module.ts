import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MhdIconComponent} from './mhd-icon/mhd-icon.component';
import {MhdLogoComponent} from "./mhd-logo/mhd-logo.component";

@NgModule({
  imports: [CommonModule, MhdIconComponent, MhdLogoComponent],
  exports: [MhdIconComponent, MhdIconComponent],
})
export class MhDesignModule {
}
