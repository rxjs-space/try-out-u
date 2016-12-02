import { Pipe, PipeTransform } from '@angular/core';
import { LogService } from '../services/log.service';

@Pipe({
  name: 'logIt',
  pure: false
})
export class LogItPipe implements PipeTransform {
  constructor(private logService: LogService) {}
  transform(entity: any, prop: string, deeperProp?: string, args?: any): any {
    let log = {
      constructorOfComponent: entity.constructor.name,
      cd: Reflect.getMetadata('annotations', entity.constructor)[0].changeDetection
    };

    if (prop) {
      log[prop] = entity[prop];
      if (entity[prop] && deeperProp) {
        log[deeperProp] = entity[prop][deeperProp];
      }
    }



    this.logService.addLog(log);
    return null;
  }

}

    // let annotations = Reflect.getMetadata('annotations', this.constructor);
    // console.log(annotations);
    // console.log(annotations[0].changeDetection);


