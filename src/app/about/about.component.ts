import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  faqsList: any[] = [];
  isLoading: boolean = false;
  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.httpService.getFaqs().subscribe((response: any) => {
      this.isLoading = false;
      this.faqsList = response?.faq
    })
  }

}
