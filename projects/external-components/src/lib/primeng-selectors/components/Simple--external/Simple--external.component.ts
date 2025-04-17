import { Component } from '@angular/core';
import { CommonExternalComponent } from '../common-external/common-external.component';

@Component({
  selector: 'simple',
  template: `<div style="color: green;">This is the Simple component extending CommonExternalComponent.</div>`,
  styles: []
})
export class SimpleComponent extends CommonExternalComponent {}