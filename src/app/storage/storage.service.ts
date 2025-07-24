import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  // If the user is logged in, notes are saved to the database (TODO), else - to the localStorage
  private isAuthenticated: boolean = false; // Authentication later to be added

  save<T>(data: T, key?: string): boolean {
    if (!this.isAuthenticated) {
      if (key) {
        try {
          const json = JSON.stringify(data);
          if (!json) throw new Error('Error trying to JSON.stringify');
          localStorage.setItem(key, json);
        } catch (e) {
          console.error(e);
        }
      }
    }

    return true;
  }

  read<T>(key?: string): T | null {
    if (!this.isAuthenticated) {
      if (key) {
        try {
          const data = localStorage.getItem(key);
          if (!data) throw new Error('Error trying to get localStorage data');

          const result = JSON.parse(data);
          if (result !== 0 && !result)
            throw new Error('Error trying to get JSON.parse localStorage data');
          return result;
        } catch (e) {
          console.error(e);
        }
      }
    }

    return null;
  }
}
