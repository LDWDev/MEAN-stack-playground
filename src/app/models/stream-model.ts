import { Subject, Subscription, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { OnDestroy, Injectable } from "@angular/core";

@Injectable()
export class StreamModel implements OnDestroy {
  public subscriptions: Subscription[];
  private _destroy$: Subject<boolean>;
  constructor() {
    this.subscriptions = [];
    this._destroy$ = new Subject();
    console.log("created instance with signature",Math.random());
  }

  public registerSubscription<T>(
    stream: Observable<T>,
    callBack: (o: T) => void
  ): void {
    const sub = stream
      .pipe(takeUntil(this._destroy$))
      .subscribe(o => callBack(o));
    this.subscriptions.push(sub);
  }

  public ngOnDestroy(): void {
    console.log("tore down");
    this.tearDownSubscriptions();
  }
  private tearDownSubscriptions(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
