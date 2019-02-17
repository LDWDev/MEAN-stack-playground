import {
  Directive,
  ElementRef,
  OnInit,
  Output,
  EventEmitter,
  Input
} from "@angular/core";
import { fromEvent } from "rxjs";
import { StreamHandler } from "../services/stream-handler.service";

@Directive({
  selector: "[clickDetector]",
  providers: [StreamHandler]
})
export class ClickDetectorDirective implements OnInit {
  constructor(
    private el: ElementRef<HTMLElement>,
    public streams: StreamHandler
  ) {
    this.clickedInOrOutside = new EventEmitter();
  }

  @Output() public clickedInOrOutside: EventEmitter<boolean>;
  @Input() public emitDistinctOnly: boolean;

  private _lastClickedElement: HTMLElement;

  public ngOnInit(): void {
    this.streams.register(fromEvent<MouseEvent>(window, "click"), o =>
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
