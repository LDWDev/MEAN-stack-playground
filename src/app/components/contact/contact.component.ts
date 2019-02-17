import { Component, OnInit } from "@angular/core";
import { StreamHandler } from "src/app/services/stream-handler.service";

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
