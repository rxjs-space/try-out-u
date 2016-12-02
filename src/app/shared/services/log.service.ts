import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class LogService {
  private _logs: any[] = [];

  constructor(private zone: NgZone) {
    zone.onStable.subscribe(v => {
      let logs = this._logs;
      this._logs = [];
      if (!logs.length) { return; }
      if (!console.group) { return; }
      console.group();
      logs.forEach(log => console.log(log));
      console.groupEnd();
    });
  }

  addLog(logItem) {
    this._logs.push(logItem);
  }
}
