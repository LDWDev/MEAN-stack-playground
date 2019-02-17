import { Component, OnInit } from "@angular/core";
import { StreamModel } from "src/app/models/stream-model";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
  providers: [StreamModel]
})
export class ContactComponent implements OnInit {
  constructor(private streams: StreamModel) {}

  ngOnInit() {}
}
