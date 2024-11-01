import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'master-thesis-prototype';
  protected readonly console = console;
  items = [
    {title: 'Explore the Docs', link: 'https://angular.dev'},
    {title: 'Learn with Tutorials', link: 'https://angular.dev/tutorials'},
    {title: 'CLI Docs', link: 'https://angular.dev/tools/cli'},
    {title: 'Angular Language Service', link: 'https://angular.dev/tools/language-service'},
    {title: 'Angular DevTools', link: 'https://angular.dev/tools/devtools', onClick: () => console.log("Hello World!")},
  ]

  // Type guard to check if an item has an onClick property
  hasOnClick(item: { link: string; title: string; onClick?: () => void }): item is { link: string; title: string; onClick: () => void } {
    return typeof item.onClick === 'function';
  }

}

