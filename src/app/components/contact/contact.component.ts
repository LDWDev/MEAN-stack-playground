import { Component, OnInit } from "@angular/core";
import { StreamHandler } from "src/app/models/stream-model";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
  providers: [StreamHandler]
})
export class ContactComponent implements OnInit {
  constructor(private streams: StreamHandler) {}

  ngOnInit() {}
}
