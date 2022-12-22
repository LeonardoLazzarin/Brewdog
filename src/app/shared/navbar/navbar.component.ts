import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  randomBeerVisible: boolean;

  constructor(
    private route: Router
  ) {
    this.randomBeerVisible = true;
  }

  ngOnInit() {
    // Event when route change
    this.route.events.subscribe(this.onRouterEvent);
  }

  onRouterEvent(event: any) {
    // Check if the event is a navigation star
    if (event instanceof NavigationStart) {
      const navigation = event as NavigationStart;

      // If the route is random beer hide the button on NavBar
      this.randomBeerVisible = !(navigation.url === '/beer/random');
      console.log(navigation.url);
      console.log(this.randomBeerVisible);
    }
  }
}
