//#region Use finalize for side effects on completion

// // begin lesson code
// import { interval, fromEvent, throwError } from 'rxjs';
// import { takeUntil, finalize } from 'rxjs/operators';

// // elems
// const counter = document.getElementById('counter');

// // streams
// const click$ = fromEvent(document, 'click');

// // const sub = interval(1000).subscribe({
// //   next: (val: any) => {
// //     counter.innerHTML = val;
// //   },
// //   complete: () => {
// //     counter.innerHTML = 'Stopped!'
// //   }
// // });

// // calling unsubscribe will not trigger complete callbacks
// // setTimeout(() => {
// //   sub.unsubscribe();
// // }, 2000);

// // operators that complete observables will, like take and takeUntil
// // interval(1000).pipe(
// //   takeUntil(click$)
// // ).subscribe({
// //   next: (val: any) => {
// //     counter.innerHTML = val;
// //   },
// //   complete: () => {
// //     counter.innerHTML = 'Stopped!'
// //   }
// // });

// /*
//  * You can also use finalize, which lets you run a function
//  * on completion of the observable. This is good for misc side-effects,
//  * but note, like tap, does not actually emit a returned item.
//  * 
//  * If you need to emit a final value on completion you can use
//  * the endWith operator instead.
//  */
// interval(1000).pipe(
//   takeUntil(click$),
//   finalize(() => counter.innerHTML = 'Stopped!')
// ).subscribe((val: any) => counter.innerHTML = val);

// /*
//  * finalize function will also be called if an error
//  * occurs.
//  */
// // throwError(new Error('Oops!')).pipe(
// //   takeUntil(click$),
// //   finalize(() => counter.innerHTML = 'Stopped!')
// // ).subscribe((val: any) => counter.innerHTML = val);


//#endregion

//Usar la de abajo para hacer un retry en caso de que la conexion con el servidor no sea exitosa
//#region Extract common operator logic into standalone functions

// // begin lesson code
// import { fromEvent, throwError, timer, range, of, Observable } from 'rxjs';
// import { takeUntil, finalize, zip, mergeMap, retryWhen, mergeMapTo, catchError } from 'rxjs/operators';

// // streams
// const click$ = fromEvent(document, 'click');

// export const genericRetryStrategy = ({
//   retryAttempts = 3,
//   scalingDuration = 1000,
//   excludedStatusCodes = []
// }: {
//   retryAttempts?: number;
//   scalingDuration?: number;
//   excludedStatusCodes?: number[];
// } = {}) => (obs: Observable<any>) => {
//   return obs.pipe(
//     retryWhen(attempts => {
//       return attempts.pipe(
//         mergeMap((error, i) => {
//           const attemptNumber = i + 1;
//           if (
//             attemptNumber > retryAttempts ||
//             excludedStatusCodes.find(e => e === error.status)
//           ) {
//             console.log('Giving up!');
//             return throwError(error);
//           }
//           console.log(
//             `Attempt ${attemptNumber}: retrying in ${attemptNumber *
//             scalingDuration}ms`
//           );
//           return timer(attemptNumber * scalingDuration);
//         })
//       );
//     })
//   );
// };

// /* 
//  * Instead of dragging all of the retry logic around,
//  * we can extract it into a customizable function
//  * that can be used throughout our application.
//  */
// // click$.pipe(
// //   mergeMapTo(throwError({
// //     status: 400,
// //     message: 'Server error'
// //   }).pipe(
// //       retryWhen(attempts => {
// //         return attempts.pipe(
// //           mergeMap((error, i) => {
// //             const attemptNumber = i + 1;
// //             if (
// //               attemptNumber > 3 ||
// //               [404, 500].find(e => e === error.status)
// //             ) {
// //               console.log('Giving up!');
// //               return throwError(error);
// //             }
// //             console.log(
// //               `Attempt ${attemptNumber}: retrying in ${attemptNumber *
// //               1000}ms`
// //             );
// //             return timer(attemptNumber * 1000);
// //           })
// //         );
// //       }),
// //       catchError(err => of(err.message))
// //     )
// //   )
// // ).subscribe(console.log);

// // simulate network request with error
// click$.pipe(
//   mergeMapTo(throwError({
//     status: 500,
//     message: 'Server error'
//   }).pipe(
//     genericRetryStrategy({
//       retryAttempts: 4,
//       scalingDuration: 2000
//     }),
//     // you may want different catching strategy depending on page
//     catchError(err => of(err.message))
//   ))
// ).subscribe(console.log);

//#endregion

//acceder al estado de un observer desde otro
//#region Use combination operators to access state from secondary streams

// // begin lesson code
// import { fromEvent, of, BehaviorSubject, Subject } from 'rxjs';
// import {
//   concatMap,
//   delay,
//   withLatestFrom,
//   pluck
// } from 'rxjs/operators';

// // elems
// const radioButtons = document.querySelectorAll('.radio-option');

// const store$ = new BehaviorSubject({
//   testId: 'abc123',
//   complete: false,
//   moreData: {}
// });

// const saveAnswer = (answer, testId) => {
//   // simulate delayed request
//   return of({
//     answer,
//     testId
//     // TRY TO AVOID THIS
//     // testId: store$.value.testId
//   }).pipe(delay(200));
// };

// // streams
// const answerChange$ = fromEvent(radioButtons, 'click');

// answerChange$.pipe(
//   /*
//    * Instead use withLatestFrom to grab extra
//    * state that you may need.
//    */
//   withLatestFrom(store$.pipe(pluck('testId'))),
//   concatMap(([event, testId]: any) => {
//     return saveAnswer(event.target.value, testId)
//   })
// )
// .subscribe(console.log);

//#endregion

//para hacer unsubscribe a varios observers infinitos al mismo tiempo
//#region Unsubscribe Process with take until


// import { interval, fromEvent, Subject } from 'rxjs';
// import { takeUntil, map, throttleTime } from 'rxjs/operators';

// /*
//  * 1st approach, explicitly unsubscribe to every
//  * subscription.
//  */
// // const clickSub = fromEvent(document, 'click').pipe(
// //   map((event: any) => ({
// //     x: event.clientX,
// //     y: event.clientY
// //   }))
// // ).subscribe(v => {
// //   // take action
// //   console.log(v);
// // });

// // const scrollSub = fromEvent(document, 'scroll').pipe(
// //   throttleTime(30)
// // ).subscribe(v => {
// //   // take action
// //   console.log(v);
// // });

// // const intervalSub = interval(1000).subscribe(v => {
// //   // take action
// //   console.log(v);
// // });

// // setTimeout(() => {
// //   clickSub.unsubscribe();
// //   scrollSub.unsubscribe();
// //   intervalSub.unsubscribe();
// // });

// /*
//  * 2nd approach, add all subscriptions together and
//  * unsubscribe at once.
//  */
// // const subscription = fromEvent(document, 'click').pipe(
// //   map((event: any) => ({
// //     x: event.clientX,
// //     y: event.clientY
// //   }))
// // ).subscribe(v => {
// //   // take action
// //   console.log(v);
// // });

// // subscription.add(
// //   fromEvent(document, 'scroll').pipe(
// //     throttleTime(30)
// //   ).subscribe(v => {
// //     // take action
// //     console.log(v);
// //   })
// // );

// // subscription.add(
// //   interval(1000).subscribe(v => {
// //     // take action
// //     console.log(v);
// //   })
// // );

// // setTimeout(() => {
// //   subscription.unsubscribe();
// // }, 2000);

// /*
//  * 3rd (my preferred) approach, use a Subject and the
//  * takeUntil operator to automate the unsubscribe
//  * process on a hook.
//  */
// const onDestroy$ = new Subject();

// fromEvent(document, 'click').pipe(
//   map((event: any) => ({
//     x: event.clientX,
//     y: event.clientY
//   })),
//   takeUntil(onDestroy$)
// ).subscribe(v => {
//   // take action
//   console.log(v);
// });

// fromEvent(document, 'scroll').pipe(
//   throttleTime(30),
//   takeUntil(onDestroy$)
// ).subscribe(v => {
//   // take action
//   console.log(v);
// })

// interval(1000).pipe(
//   takeUntil(onDestroy$)
// ).subscribe(v => {
//   // take action
//   console.log(v);
// });

// setTimeout(() => {
//   onDestroy$.next();
//   onDestroy$.complete();
// }, 2000);

//#endregion

//#region Use filter and partition for conditional logic

// import { fromEvent, partition } from 'rxjs';
// import { filter, pluck } from 'rxjs/operators';

// const MOVE_SPEED = 20;
// let leftPosition = 0;

// // elems
// const box = document.getElementById('box');

// // streams
// const click$ = fromEvent(document, 'click');
// const xPositionClick$ = click$.pipe(pluck('clientX'));

// // xPositionClick$.subscribe(xPos => {
// //   /*
// //    * Generally if you have a single if statement in
// //    * you subscribe block, prefer filter instead.
// //    */
// //   if(xPos < window.innerWidth / 2) {
// //     box.style.left = `${leftPosition -= MOVE_SPEED}px`;
// //   }
// // });

// /*
//  * Filtering for specific condition before subscribe
//  */
// // xPositionClick$.pipe(
// //   filter(xPos => xPos < window.innerWidth / 2)
// // ).subscribe(xPos => {
// //   box.style.left = `${leftPosition -= MOVE_SPEED}px`;
// // });

// /*
//  * In case of if / else in subscribe...
//  */
// // xPositionClick$.subscribe(xPos => {
// //   /*
// //    * Generally if you have a single if statement in
// //    * you subscribe block, prefer filter instead.
// //    */
// //   if(xPos < window.innerWidth / 2) {
// //     box.style.left = `${leftPosition -= MOVE_SPEED}px`;
// //   } else {
// //     box.style.left = `${leftPosition += MOVE_SPEED}px`;
// //   }
// // });

// /*
//  * You can use partition instead to create
//  * 2 separate streams.
//  */
// const [ clickLeft$, clickRight$ ] = partition(
//   xPositionClick$,
//   xPos => xPos < window.innerWidth / 2
// );

// clickLeft$.subscribe(() => {
//   box.style.left = `${leftPosition -= MOVE_SPEED}px`;
// });

// clickRight$.subscribe(() => {
//   box.style.left = `${leftPosition += MOVE_SPEED}px`;
// });
//#endregion






