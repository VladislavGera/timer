import { Component, OnInit } from '@angular/core';
import { interval, scan, startWith, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  pendingClick: any;
  clicked: number = 0;
  time_dbclick: number = 500; // 500ms

  seconds: number | undefined = 0;
  pause: boolean | undefined = true;
  title: string = 'Angular Timer';
  value: string = '--:--';

  private counterSubjects: Subject<{ pause?: boolean; counterValue?: any }> =
    new Subject();

  convert(value: any): string {
    return Math.floor(value / 60) + ':' + (value % 60 ? value % 60 : '0');
  }

  ngOnInit(): void {
    this.initializeCounter();
  }

  private initializeCounter() {
    this.counterSubjects
      .pipe(
        startWith({ pause: true, counterValue: 0 }),
        scan((acc, val) => ({ ...acc, ...val })),
        tap((state) => {
          this.seconds = state.counterValue;
          this.pause = state.pause;
          this.value = this.convert(this.seconds);
        }),
        switchMap((state) =>
          state.pause
            ? ''
            : interval(1000).pipe(
                tap(() => {
                  state.counterValue += 1;
                  this.seconds = state.counterValue;
                  this.pause = state.pause;
                  this.value = this.convert(this.seconds);
                })
              )
        )
      )
      .subscribe();
  }

  startCounter() {
    this.counterSubjects.next({ pause: false, counterValue: this.seconds });
  }

  pauseCounter() {
    this.counterSubjects.next({ pause: true, counterValue: 0 });
  }

  resetCounter() {
    this.counterSubjects.next({ pause: false, counterValue: 0 });
  }

  waitCounter() {
    this.clicked++;
    if(this.clicked >= 2){
      this.doubleClick()
      clearTimeout(this.pendingClick)
      this.clicked = 0;
      return;
    }
    clearTimeout(this.pendingClick)
    this.pendingClick = setTimeout(() => {
      // one click
      this.clicked = 0;
    }, this.time_dbclick);
  }

  doubleClick() {
    this.counterSubjects.next({ pause: true, counterValue: this.seconds });
  }
}
