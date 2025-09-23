import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserActions } from './state/user.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'gratistoria';

  private store = inject(Store);

  ngOnInit() {
    // Trigger user profile fetch on app start
    this.store.dispatch(UserActions.getUser());
  }
}
