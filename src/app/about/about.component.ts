import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  iconToggle: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleIcon() {
    this.iconToggle = !this.iconToggle
  }

}
