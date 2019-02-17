import {
  Directive,
  ElementRef,
  OnInit,
  Output,
  EventEmitter,
  Input
} from "@angular/core";
import { fromEvent } from "rxjs";
import { StreamModel } from "../models/stream-model";

@Directive({
  selector: "[clickDetector]",
  providers: [StreamModel]
})
export class ClickDetectorDirective implements OnInit {
  constructor(private el: ElementRef<HTMLElement>, public streams: StreamModel) {
    this.clickedInOrOutside = new EventEmitter();
  }

  @Output() public clickedInOrOutside: EventEmitter<boolean>;
  @Input() public emitDistinctOnly: boolean;

  private _lastClickedElement: HTMLElement;

  public ngOnInit(): void {
    this.streams.registerSubscription(fromEvent<MouseEvent>(window, "click"), o =>
      this.clickEventCallback(o)
    );
  }

  private clickEventCallback(o: MouseEvent): void {
    if (this.emitDistinctOnly) {
      if (o.target != this._lastClickedElement) {
        this._lastClickedElement = o.target as HTMLElement;
      } else {
        return;
      }
    }
    const clickedInside = o.target == this.el.nativeElement;
    this.clickedInOrOutside.emit(clickedInside);
  }
}
