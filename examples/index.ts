import Timer from '../src/promised-timer';

document.write('<h1>promised-timer</h1>');

let mainTimer = Timer.Seconds(0.5);
mainTimer.start(() =>{
  document.querySelector("h1").innerText += " examples";
});

document.write("<input type='text' placeholder='Type and wait 3 sec'></input>");
document.write(" <small><span id='q1'></span></small>");

let inactivityTimer = Timer.Seconds(3);
let q1 = document.querySelector('#q1');

let magic = () => {
   q1.innerHTML = 'Magic happens...';
   Timer.delay(500, () => {
      q1.innerHTML = '';
      inactivityTimer.hold(magic);
   });
};

inactivityTimer.hold(magic);
document.querySelector('input[type=text]').addEventListener('keydown',
  () => inactivityTimer.rewind());

document.write("<br/><br/>");
document.write("<input type='button' value='Start'/> ");
document.write("<input type='button' value='Cancel'/> ");
document.write(" <small><span id='q2'></span></small>");

let bTimer = Timer.Seconds(5);
let q2 = document.querySelector('#q2');

document.querySelector('input[value=Start]').addEventListener('click',
  () => {
    q2.innerHTML = '5 seconds started';
    bTimer.start(()=>q2.innerHTML = 'Caboom');
  });

document.querySelector('input[value=Cancel]').addEventListener('click',
  () => {
    q2.innerHTML = 'Disaster averted';
    bTimer.cancel();
    Timer.delay(500, () => q2.innerHTML = '');
  });
