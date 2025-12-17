
import { Component } from '@angular/core';

@Component({
  standalone: true,
  templateUrl: './content.component.html',
})
export class ContentComponent {

  public page = {
    name: 'content',
    children: [
      {
        name: 'sections',
        filters: [
          {
            id: 'APPLICATIONS',
            config: {
              multi: true,
              source: 'mh-be',
              defaultSet: true,
            }
          },
          {
            id: 'DEVICE_TYPE',
            config: {
              multi: true,
              source: 'mh-be',
              defaultSet: false,
            }
          },
          {
            id: 'FREE_PAYING',
            config: {
              multi: true,
              source: 'mh-be',
              defaultSet: false,
            }
          },
          {
            id: 'WALL_TYPE',
            config: {
              multi: true,
              source: 'mh-be',
              defaultSet: false,
            }
          },
          {
            id: 'VISIT_TYPE',
            config: {
              multi: true,
              source: 'mh-be',
              defaultSet: false,
            }
          }
        ]
      }
    ]
  }

}
