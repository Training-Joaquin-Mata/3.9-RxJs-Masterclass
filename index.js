import { Subject, interval, BehaviorSubject, ReplaySubject, fromEvent, of, AsyncSubject, asyncScheduler, asapScheduler, animationFrameScheduler, queueScheduler, async } from 'rxjs';
import { QueueScheduler } from 'rxjs/internal/scheduler/QueueScheduler';
import { mergeMap, mergeMapTo, multicast, observeOn, refCount, share, shareReplay, subscribeOn, take, takeWhile, tap} from 'rxjs/operators';

    const observer = {
         next: val => console.log('next', val),
         error: err => console.log('error', err),
            complete: () => console.log('complete')
         };

//#region Subjects and multicasting operators

    //#region Share data among multiple subscribers with Subjects
// /**
//  * Subjects son como una mezcla entre observers y observables
//  */
// //Aqui declaramos los metodos de next, error y complete
// const observer = {
//     next: val => console.log(`Next: ${val}`),
//     error: err => console.log(`Èrror:${err}`),
//     complete: () => console.log("Complete!")
// };

// //Se crea un subject
// const subject = new Subject();

// //Se crea una constante llamada subscription la cual tiene
// //el subscribe del subject y se le pasa como parametro para 
// //el next, error y complete los que ya se habian declarado en 'observer'
// const subscription = subject.subscribe(observer);

// //Se pueden llamar a los metodos de observer
// //En este ejemplo solo el observer que ya habiamos creado recibe el hello
// //subject.next('Hello');

// //Creamos otra subscipcion al observer, ya que el subject es multicast

// const subscription2 = subject.subscribe(observer);
// //Aqui al tener los dos ya suscritos al subject reciben los dos el .next
// //subject.next('World');

// const interval$ = interval(2000).pipe(
//     tap(value => console.log(`New Interval: ${value}`)),
// );

// //Asi seria llamar dos observers sin subject
// // interval$.subscribe(observer);
// // interval$.subscribe(observer);

// //Asi seria llamando a las dos subscripciones que tiene el subject
// //interval$.subscribe(subject);

//#endregion

    //#region Lab: Manage application loading state with Subjects
// import { loadingService } from './loadingService'

// //Se obtiene el elemento del html
// const loadingOverlay = document.getElementById('loading-overlay');

// // const loading$ = new Subject();

// // loading$.subscribe(isLoading => {
// //   if(isLoading) {    
// //     loadingOverlay.classList.add('open');    
// //   } else {    
// //     loadingOverlay.classList.remove('open')
// //   }
// // });

// // loading$.next(true);

// // setTimeout(() => loading$.next(false), 1500);


// loadingService.loadingStatus$.subscribe(isLoading => {
//   if(isLoading) {    
//     console.log("entra en el add")
//     loadingOverlay.classList.add('open');    
//   } else {    
//     console.log("entra en el remove")
//     loadingOverlay.classList.remove('open')
//   }
// });

// loadingService.showLoading();

// setTimeout(() => loadingService.hideLoading(), 1500);


//#endregion

    //#region Automate the sharing of observables with multicast and share

// const observer = {
//     next: val => console.log(`Next: ${val}`),
//     error: err => console.log(`Error: ${err}`),
//     complete: () => console.log('Complete!')
// }

// const subject = new Subject();
// const interval$ = interval(2000).pipe(tap(i=> console.log(`Interval: ${i}`))); 

// multiCastedInterval$ = interval$.pipe(
//     // multicast(()=>new Subject()),
//     // //Con refCount cuando ya no hay mas observers termina el observer de interval
//     // refCount()
//     share(),//Aqui Share funciona como si juntaras multicast y refCount
// );
// //Para que funcione como el codigo de abajo hay que incluir el connect
// const connectedSub = multiCastedInterval$.connect();

// const subOne = multiCastedInterval$.subscribe(observer);
// const subTwo = multiCastedInterval$.subscribe(observer);

// //Aunque aqui se haga un unsubscribe, interval$ va a seguir corriendo
//  setTimeout(()=>{subOne.unsubscribe(); subTwo.unsubscribe();}, 3000)

// // //Aqui ya termina con todos los observers
// // setTimeout(()=>{connectedSub.unsubscribe()}, 3000)

// //interval$.subscribe(subject)

// // const subOne = subject.subscribe(observer);
// // const subTwo = subject.subscribe(observer);


//#endregion

    //#region Deliver a starting value to subscribers with BehaviorSubjects

// const observer = {
//     next: val=> console.log(val),
//     error: err => console.log(err),
//     complete: ()=> console.log('Complete!')
// }
// //Necesitas pasar un valor para usar behaviourSubject
// //con BehaviorSubject cuando un nuevo observer se suscribe 
// //se le asigna el ultimo valor al que se le hizo next 
// const subject = new BehaviorSubject("hello");

// const subscription = subject.subscribe(observer);

// const secondSubscription = subject.subscribe(observer);

// subject.next("world");

// setTimeout(()=>{const thirdSubscription = subject.subscribe(observer);}, 3000)

//#endregion

    //#region Lab: Build a basic application store with Subjects
// import { ObservableStore } from './store';

// const store = new ObservableStore({
//     user: 'Joaquin',
//     isAuthenticated: false
// });

// //Antes de añadir el updateState solo mostrará 'joaquin', despues del updateState 'joaquin' 'joe' 
// store.selectState('user').subscribe(console.log);

// store.updateState({
//     user:'joe'
// });

//#endregion

    //#region Replay history to new subscribers with ReplaySubjects

// const observer={
//     next: val=> console.log(`Next: ${val}`),
//     error: err=> console.log(`Error: ${err}`),
//     complete: ()=> console.log(`Complete!!`)
// };
// //Con replay cuando suubscribes un nuevo observer se le pasan todos los 
// //valores que ya se le han pasado a los observers anteriores, 
// //o la cantidad de ultimos valores que tu quieras
// const subject = new ReplaySubject(1);
// //subject.subscribe(observer);
// subject.next('Hello')
// subject.next('World')
// subject.next('Goodbye')
// subject.subscribe(observer);


//#endregion

    //#region Automate multicasting and replaying with shareReplay
// import { ajax } from 'rxjs/ajax'

//     const observer = {
//          next: val => console.log('next', val),
//          error: err => console.log('error', err),
//             complete: () => console.log('complete')
//          };

//     const ajax$ = ajax('https://api.github.com/users/octocat');

//     const click$ = fromEvent(document, 'click');

//     const clickRequest$ = click$.pipe(
//         mergeMapTo(ajax$),
//         shareReplay(1, 10000)//Agregando shareReplay solo se genera una consulta al servidor, pero se siguen tomando los dos valores de abajo
//     )

//     clickRequest$.subscribe(observer);
//    // clickRequest$.subscribe(observer);//Al agregar otra subscripcion, aqui, se generan dos request al servidor


// setTimeout(()=>{
//     console.log("Second subs")
//     clickRequest$.subscribe(observer);
// }, 5000)
//#endregion

    //#region Deliver the last value on complete with AsyncSubjects

//Con asyncSubject le envia el ultimo valor a los observers cuando se completa

    // const observer = {
    //      next: val => console.log('next', val),
    //      error: err => console.log('error', err),
    //         complete: () => console.log('complete')
    //      };

    // const subject = new AsyncSubject();

    // subject.subscribe(observer);
    // subject.subscribe(observer);
    

    // subject.next("hello")
    // subject.next("World")
    // subject.next("Goodbye")

    // subject.complete();

//#endregion

//#endregion

//#region Introduction to Scheduler

    //#region Whats an Scheduler?

// asyncScheduler.schedule(()=> console.log("async"));
// asapScheduler.schedule(()=>console.log("microtask"));
// animationFrameScheduler.schedule(()=>console.log("Animation Frame"));
// queueScheduler.schedule(()=>{console.log("Queue Scheduler")/**Schedule tasks inside other tasks */});

// /**
//  * Execution order:
//  * 1.Queue Shceduler
//  * 2.Microtask
//  * 3.Animation Frame
//  * 4.Async
//  */

// //Para usar con observables

// //Se pueden usar como argumento
// of(1,2,3,4,5, asyncScheduler).subscribe(observer);

// //Con el operador observeOn
// interval(20).pipe(
//     observeOn(animationFrameScheduler),
//     take(5)
// ).subscribe(observer);


// //Con el operador subscribeOn
// interval(20).pipe(
//     subscribeOn(asyncScheduler),
//     take(5)
// ).subscribe(observer);

//#endregion

    //#region Execute tasks asynchronously with Async Scheduler

    // //      //Los schedulers tienen tres parametros, work, delay?, state?
    // //  const sub = asyncScheduler.schedule(
    // //          console.log,
    // //          2000,
    // //         'hello world'
    // //      )
    // // //Shcedule te regresa una funcion del tipo subscription por lo que puedes hacer un unsubsc..
    // //      console.log("sync")
    // //      sub.unsubscribe();


    // //of(4,5,6, async).subscribe(observer);
    // //of(4,5,6).pipe(tap((val)=>console.log("From tap", val) ),observeOn(asyncScheduler, 3000)).subscribe(observer);
    // of(4,5,6).pipe(tap((val)=>console.log("From tap", val) ),subscribeOn(asyncScheduler, 3000)).subscribe(observer);
    
    // of(1,2,3).subscribe(observer);

    //#endregion

    //#region Defer task execution with the asap scheduler

        // asyncScheduler.schedule(()=>{
        //      console.log("AsyncScheduler");
        //  })
         
        // asapScheduler.schedule(()=>{
        //     console.log("AsapScheduler");
        // })
         
        // queueMicrotask(()=>{console.log("From Microtask")})
         
        // Promise.resolve('From Promise').then(console.log);
         
        // console.log("synchronous log")

    //#endregion

    //#region Schedule tasks before browser repaint with the Animation Frame Scheduler

    const ball = document.getElementById('ball')

    // animationFrameScheduler.schedule(function(position){

    //     ball.style.transform = `translate3d(0, ${position}px, 0)`;

    //     if(position<=300){
    //         this.schedule(position + 1);
    //     }
    //     },0,0)


    interval(0, animationFrameScheduler).pipe(
        takeWhile(val=> val<=300),
    ).subscribe(val=>{
        ball.style.transform = `translate3d(0, ${val}px, 0)`;
    });


     //#endregion

    //#region 

    queueScheduler.schedule(()=>{
             queueScheduler.schedule(()=>{
                queueScheduler.schedule(()=>{console.log("Second Inner Queue")})
                console.log("Inner Queue")
                })
            console.log("first queue Log");
    });

    console.log("sync Log")

    //#endregion


//#endregion

