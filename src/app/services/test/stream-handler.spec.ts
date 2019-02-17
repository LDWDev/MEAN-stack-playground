import { StreamHandler } from "../stream-handler.service";
import { Observable, interval, Subject, of } from "rxjs";
import { map } from "rxjs/operators";
import { tick, fakeAsync, discardPeriodicTasks } from "@angular/core/testing";

let streamHandler: StreamHandler;
let observable: Observable<number>;
let asyncObservable: Observable<string>;
let deadline: Subject<boolean>;

describe("Stream handler service", () => {
  beforeEach(() => {
    observable = of(1, 2, 3, 4);
    asyncObservable = interval(1000).pipe(map(o => "emitting"));
    streamHandler = new StreamHandler();
  });
  it("should be able to register a subscription", () => {
    expect(streamHandler.subscriptions.length).toBe(0);
    streamHandler.register(observable, o => {});
    expect(streamHandler.subscriptions.length).toBe(1);
  });

  it("should be able to register and persist subscriptions", fakeAsync(() => {
    expect(streamHandler.subscriptions.length).toBe(0);
    let count = 0;
    streamHandler.register(observable, o => {});
    streamHandler.register(asyncObservable, o => {
      count++;
    });
    tick(2000);
    expect(streamHandler.subscriptions.length).toBe(2);
    expect(count).toBe(2);
    discardPeriodicTasks();
  }));

  it("should tear down persistent subscriptions on destroy and not need discardPeriodicTasks", fakeAsync(() => {
    let count = 0;
    streamHandler.register(asyncObservable, o => {
      count++;
    });
    tick(2000);
    streamHandler.subscriptions.forEach(sub => {
      expect(sub.closed).toBe(false);
    });
    streamHandler.ngOnDestroy();

    streamHandler.subscriptions.forEach(sub => {
      expect(sub.closed).toBe(true);
    });
  }));
});
