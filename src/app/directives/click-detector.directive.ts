import {
  Directive,
  ElementRef,
  OnInit,
  Output,
  EventEmitter,
  Input
} from "@angular/core";
import { Subject, Observable, fromEvent, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive({
  selector: "[clickDetector]"
})
export class ClickDetectorDirective implements OnInit {
  constructor(private el: ElementRef<HTMLElement>) {
    this.click$ = fromEvent<MouseEvent>(window, "click").pipe(
      takeUntil(this.destroy$)
    );
    this.clickedInOrOutside = new EventEmitter();
  }

  @Output() public clickedInOrOutside: EventEmitter<boolean>;
  @Input() public emitDistinctOnly: boolean;

  private destroy$ = new Subject<boolean>();
  private click$: Observable<MouseEvent>;
  private clickSubscription: Subscription;
  private _lastClickedElement: HTMLElement;

  public ngOnInit(): void {
    this.clickSubscription = this.click$.subscribe(o =>
      this.clickEventCallback(o)
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
