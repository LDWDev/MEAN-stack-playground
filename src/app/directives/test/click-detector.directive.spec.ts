import { TestBed, ComponentFixture } from "@angular/core/testing";
import { ClickDetectorDirective } from "../click-detector.directive";
import { Component, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { tick } from "@angular/core/src/render3";
import { StreamModel } from "src/app/models/stream-model";
import { Stream } from "stream";

@Component({
  selector: "click-detector-directive-test",
  template: `
    <div class="parent">
      <div
        class="element"
        clickDetector
        [emitDistinctOnly]="emitDistinctOnly"
        (clickedInOrOutside)="process($event)"
      ></div>
      <div class="sibling"></div>
    </div>
  `
})
class ClickDetectorDirectiveTestingComponent {
  public emitDistinctOnly: boolean;
  public process($event): boolean {
    return $event;
  }
}

let component: ClickDetectorDirectiveTestingComponent;
let componentFixture: ComponentFixture<ClickDetectorDirectiveTestingComponent>;
let parent: DebugElement;
let element: DebugElement;
let sibling: DebugElement;

function setup(emitDistinctOnly: boolean) {
  TestBed.configureTestingModule({
    declarations: [
      ClickDetectorDirectiveTestingComponent,
      ClickDetectorDirective
    ]
  }).compileComponents();
  componentFixture = TestBed.createComponent(
    ClickDetectorDirectiveTestingComponent
  );
  component = componentFixture.componentInstance;
  component.emitDistinctOnly = emitDistinctOnly;
  componentFixture.detectChanges();
  parent = componentFixture.debugElement.query(By.css(".parent"));
  element = componentFixture.debugElement.query(By.css(".element"));
  sibling = componentFixture.debugElement.query(By.css(".sibling"));
}

describe("Directive: ClickDetectorDirective with EmitDistinctOnly = false", () => {
  beforeEach(() => {
    setup(false);
  });

  it("should return false on parent click", () => {
    spyOn(component, "process");
    parent.nativeElement.click();
    expect(component.process).toHaveBeenCalledWith(false);
  });
  it("should return true on element click", () => {
    spyOn(component, "process");
    element.nativeElement.click();
    expect(component.process).toHaveBeenCalledWith(true);
  });
  it("should return false on sibling click", () => {
    spyOn(component, "process");
    sibling.nativeElement.click();
    expect(component.process).toHaveBeenCalledWith(false);
  });
});

describe("Directive: ClickDetectorDirective with EmitDistinctOnly = true", () => {
  beforeEach(() => {
    setup(true);
  });

  it("should should only return once on consecutive parent clicks", () => {
    spyOn(component, "process");
    parent.nativeElement.click();
    parent.nativeElement.click();
    expect(component.process).toHaveBeenCalledTimes(1);
  });
  it("should return twice on sibling then element clicks", () => {
    spyOn(component, "process");
    element.nativeElement.click();
    sibling.nativeElement.click();
    expect(component.process).toHaveBeenCalledTimes(2);
  });
  it("should call true then false on element and sibling clicks", () => {
    let spy = spyOn(component, "process");
    element.nativeElement.click();
    expect(component.process).toHaveBeenCalledWith(true);
    spy.calls.reset();
    sibling.nativeElement.click();
    expect(component.process).toHaveBeenCalledWith(false);
  });
});

describe("Directive: ClickDetectorDirective with changing EmitDistinctOnly from false to true", () => {
  beforeEach(() => {
    setup(false);
  });

  it("should should call twice then once on parent clicks when changing EmitDistinctOnly from false to true", () => {
    let spy = spyOn(component, "process");
    parent.nativeElement.click();
    parent.nativeElement.click();
    expect(component.process).toHaveBeenCalledTimes(2);
    spy.calls.reset();

    component.emitDistinctOnly = true;
    componentFixture.detectChanges();

    parent.nativeElement.click();
    parent.nativeElement.click();
    expect(component.process).toHaveBeenCalledTimes(1);
  });
});

describe("Directive subscription should be torn down on destroy", () => {
  beforeEach(() => {
    setup(true);
  });
  it("should have a subscription until on destroy is called", () => {
    const directive = componentFixture.debugElement
      .query(By.directive(ClickDetectorDirective))
      .injector.get(ClickDetectorDirective);

    directive.streams.subscriptions.forEach(subscription => {
      expect(subscription.closed).toEqual(false);
    });
    componentFixture.destroy();
    // directive.streams.ngOnDestroy();
    directive.streams.subscriptions.forEach(subscription => {
      expect(subscription.closed).toEqual(true);
    });
  });
});
