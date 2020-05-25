import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Model } from 'src/assets/interfaces/Model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {

  models: Model[];
  sourceUrl: any;
  backendApi: string = 'http://localhost:8100/api/';

  constructor(private http: HttpService, private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.http.getAllModels().subscribe((data: Model[]) => {
      this.models = data;
    });
  }

  generateSourcePath(input: String) {
    var splitInput = input.split(/ |-/);
    let result: string = this.backendApi + "image/";
    for (let i = 0; i < splitInput.length; i++) {
      result += splitInput[i];
    }
    result += ".jpg";
    return this.domSanitizer.bypassSecurityTrustUrl(result);
  }
}