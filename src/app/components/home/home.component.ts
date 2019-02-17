import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild
} from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  constructor(private renderer: Renderer2) {}
  @ViewChild("main") public el: ElementRef;

  ngOnInit() {}

  public processClickEvent($event): void {
    if ($event) {
      this.renderer.setStyle(
        this.el.nativeElement,
        "background-color",
        "lightcoral"
      );
    } else {
      this.renderer.setStyle(
        this.el.nativeElement,
        "background-color",
        "lightblue"
      );
    }
  }
}
