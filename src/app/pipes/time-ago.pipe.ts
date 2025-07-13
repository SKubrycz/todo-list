import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(date: number): string {
    const diff = Date.now() - date;
    const minute = 1000 * 60;
    const hour = 1000 * 60 * 60;
    const day = 1000 * 60 * 60 * 24;

    if (diff >= 0 && diff < minute) {
      const time = Math.round(diff / 1000);
      return `${time} second${time > 1 ? 's' : ''} ago`;
    } else if (diff >= minute && diff < hour) {
      const time = Math.round(diff / 1000 / 60);
      return `${time} minute${time > 1 ? 's' : ''} ago`;
    } else if (diff >= hour && diff < day) {
      const time = Math.round(diff / 1000 / 60 / 60);
      return `${time} hour${time > 1 ? 's' : ''} ago`;
    } else {
      const time = Math.round(diff / 1000 / 60 / 60 / 24);
      return `${time} day${time > 1 ? 's' : ''} ago`;
    }
  }
}
