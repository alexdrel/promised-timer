import Timer from '../src/promised-timer';

document.write('<h1>promised-timer</h1>');

let mainTimer = Timer.Seconds(0.5);
mainTimer.start(() => {
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
document.write("<input type='button' value='Pause'/> ");
document.write("<input type='button' value='Resume'/> ");
document.write("<input type='button' value='Cancel'/> ");
document.write(" <small><span id='q2'></span></small>");
document.write(" <h2 id='caboom'/>");

let bTimer = Timer.Seconds(5);
let statusTimer = Timer.Seconds(0.5);
let q2 = document.querySelector('#q2');
let caboom = document.querySelector('#caboom');

statusTimer.repeat(() => q2.innerHTML = '');

document.querySelector('input[value=Start]').addEventListener('click',
  () => {
    q2.innerHTML = `${bTimer.getSeconds()} seconds started`;
    caboom.innerHTML = '';
    (document.querySelector('input[value=Pause]') as HTMLButtonElement).disabled = false;
    (document.querySelector('input[value=Resume]') as HTMLButtonElement).disabled = true;

    bTimer.start(() => caboom.innerHTML = 'Caboom');
    statusTimer.rewind();
  });

document.querySelector('input[value=Pause]').addEventListener('click',
  () => {
    q2.innerHTML = 'Disaster delayed';
    bTimer.pause();
    (document.querySelector('input[value=Pause]') as HTMLButtonElement).disabled = true;
    (document.querySelector('input[value=Resume]') as HTMLButtonElement).disabled = false;
    statusTimer.rewind();
  });

document.querySelector('input[value=Resume]').addEventListener('click',
  () => {
    q2.innerHTML = 'Disaster is near';
    bTimer.resume();
    (document.querySelector('input[value=Pause]') as HTMLButtonElement).disabled = false;
    (document.querySelector('input[value=Resume]') as HTMLButtonElement).disabled = true;
    statusTimer.rewind();
  });


document.querySelector('input[value=Cancel]').addEventListener('click',
  () => {
    q2.innerHTML = 'Disaster averted';
    bTimer.cancel();
    statusTimer.rewind();
  });
