import { concat, of } from 'rxjs';
import { map, mergeMap, toArray, delay, catchError } from 'rxjs/operators';
import{ TestScheduler } from 'rxjs/testing'

//#region Marble testing
///Forma base para el testing
// // describe('Marbel testing in RxJS', ()=>{
// //      let testScheduler;
     
// //      beforeEach(()=>{
// //          testScheduler = new TestScheduler((actual, expected)=>{
// //              expect(actual).toEqual(expected);
// //          })
// //      });
// // it('something', ()=>{
// //     testScheduler.run(helpers=>{
// //         const {cold, expectObservable}= helpers;
// // ////codigo aqui
// //     });
// // });
// //      it('Should convert ASCII diagrams into observables', ()=>{
// //          testScheduler.run(helpers=>{
// //              //All testing logic
// //              const {cold, expectObservable}= helpers;

// //              const source$ = cold('--a-b---c');
// //              const expected = '-a-b---c';
// //              expectObservable(source$).toBe(expected);
// //          })
// //      })

// // });

// describe('Marbel testing in RxJS', ()=>{
//      let testScheduler;
     
//      beforeEach(()=>{
//          testScheduler = new TestScheduler((actual, expected)=>{
//              expect(actual).toEqual(expected);
//          })
//      });
// it('something', ()=>{
//     testScheduler.run(helpers=>{
//         const {cold, expectObservable}= helpers;
// ////codigo aqui

//         const source$ = cold('-a---b-|');
//         const sourceTwo$ = cold('-c---d-|');
//         const final$ = concat(source$, sourceTwo$);
//         const expected = '--a---b--c---d-|';
//         expectObservable(final$).toBe(expected);

//     });
// });
// });

//#endregion

//#region Testing Observables with Subscribe and Assert Pattern

//#region Test emitted values as they occur

// describe('subscribe and assert testing in RxJS', ()=>{
// it('Should compare each emitted value', ()=>{ 
// const source$ = of(1,2,3);
// const final$ = source$.pipe(
//     map(val=> val*10),
// );
// const expected = [10, 20, 30];
// let index= 0;

// final$.subscribe(val=>{
//     expect(val).toEqual(expected[index]);
//     index++;
// });
// })
// });
//#endregion 

//#region Test emitted values on completion with toArray

// describe('subscribe and assert testing in RxJS', ()=>{
//     it('Should compare emitted values on completion with toArray', ()=>{ 
//     const source$ = of(1,2,3);
//     const final$ = source$.pipe(
//         map(val=> val*10),
//         toArray(),
//     );
//     const expected = [10, 20, 30];
    
//     final$.subscribe(val=>{
//         expect(val).toEqual(expected);
//     });
//     })
//     });

//#endregion

//#region Test asynchronous operators with done callback or test scheduler


// describe('subscribe and assert testing in RxJS',() =>{
//     it('Should compare emitted values on completion with toArray',  done=>{ 
//     const source$ = of('Ready', 'Set', 'Go!').pipe(
//         mergeMap((message, index)=> of(message).pipe(
//             delay(index * 1000))
//             ));
//         const expected = ['Ready', 'Set', 'Go!'];

//         let index = 0;

//         source$.subscribe(val=>{
//             expect(val).toEqual(expected[index]);
//             index++;
//         }, null, done)
//     })
//     });
//#endregion

//#region Test error notifications with subscribe and assert

describe('subscribe and assert testing in RxJS',() =>{
    it('Should compare emitted values on completion with toArray',  done=>{ 
   TestScheduler.arguments(helpers=>{
       const { expectObservable } = helpers;
       const source$ = of({firstName: 'Joaquin', lastName:'Mata'}, null).pipe(
           map(o=> `${o.firstName} ${o.lastName}`),
           catchError(()=>{
               throw 'invalid User'
           })
       );
       const expected = ['Joaquin Mata','invalid User' ];
       let actual = [];
       let index=0;

       source$.subscribe({
        next: value=>{
            actual.push(value);
            index++;
        },
       error: error=>{
        actual.push(error);
        expect(actual).toEqual(expected)
       }
    }
       )
   })
    })
    });

//#endregion

//#endregion
