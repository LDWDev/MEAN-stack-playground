import { Subject, Subscription, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { OnDestroy, Injectable } from "@angular/core";

@Injectable()
export class StreamHandler implements OnDestroy {
  public subscriptions: Subscription[];
  private _destroy$: Subject<boolean>;
  constructor() {
    this.subscriptions = [];
    this._destroy$ = new Subject();
    console.log("created instance with signature", Math.random());
  }

  public register<T>(stream: Observable<T>, callBack: (o: T) => void): void {
    this.subscriptions.push(
      stream.pipe(takeUntil(this._destroy$)).subscribe(o => callBack(o))
    );
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
