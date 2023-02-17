import React, { useState, useEffect } from 'react';

import { Subject, interval, fromEvent, of, from, defer, BehaviorSubject } from 'rxjs';
import { map, scan, startWith, switchMap, takeUntil, takeWhile, mergeMap, delay } from 'rxjs/operators';

const taskSubject = new Subject();
const concurrentLimit = 2;

const source = taskSubject.pipe(
  mergeMap((task) => defer(() => from(task())), concurrentLimit),
);

source.subscribe((val) => console.log(val));

const addTask = (task) => {
  taskSubject.next(task);
};

const Elevator = () => {
  return (
    <div onClick={() => {
      addTask(() => {
        console.log('do task1');
        return new Promise((res) => {
          setTimeout(() => {
            res({ data: 'success request 1' });
          }, 3000);
        });
      });
      addTask(() => {
        console.log('do task2');
        return new Promise((res) => {
          setTimeout(() => {
            res({ data: 'success request 2' });
          }, 1000);
        });
      });
      addTask(() => {
        console.log('do task3');
        return new Promise((res) => {
          setTimeout(() => {
            res({ data: 'success request 3' });
          }, 100);
        });
      });

      addTask(() => {
        console.log('do task4');
        return new Promise((res) => {
          setTimeout(() => {
            res({ data: 'success request 4' });
          }, 1000);
        });
      });
      // addTask(() => new Promise((resolve) => setTimeout(() => resolve({ data: 'request 3' }), 100)));
      // addTask(() => new Promise((resolve) => setTimeout(() => resolve({ data: 'request 4' }), 1000)));
    }}
    >dd


    </div>

  );
};

export default Elevator;

