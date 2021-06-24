/// <reference path="../../../../../types/browser.d.ts" />

nodecg.log.info('==> Dashboard panel \'panel\' loaded');

// Use NodeCG to transmit a message; this will be sent to the extension on the
// server as well as any other panels or graphics that are listening for a
// message of this name.
function transmitMessage(msg: string) : void {
  nodecg.log.info(`Transmitting [msg]: '${msg}'`)
  nodecg.sendMessage('message', msg).then();
}

// When the form button is clicked, send a message off.
const button = document.getElementById('transmit');
button.addEventListener('click', (e: Event) => transmitMessage('I am a sample message'));

// This replicant shares a name with the one in the graphic, so whenever either
// end changes the value, the other end is notified. Here in the panel, we
// don't listen for changes and instead only initiate them.
const replicant = nodecg.Replicant('bannerText');


const panelForm = document.getElementById('banner-update');
const text = <HTMLInputElement> document.getElementById('banner-text');

// When the form submit button is clicked, update the replicant in the graphic
// with the new value.
panelForm.addEventListener('submit', e => {
    e.preventDefault();
    replicant.value = text.value;
});