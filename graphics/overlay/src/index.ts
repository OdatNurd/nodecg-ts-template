/// <reference path="../../../../../types/browser.d.ts" />

nodecg.log.info('==> Graphic \'overlay\' loaded');

// Look up the element in the overlay that will contain our text.
const banner = document.getElementById('banner');

// Create a replicant that shares a name with the one in the dashboard panel;
// when that replican't value changes, nodecg will synchronize the value with
// all other instances of replicants with the same name. So. this will trigger
// and we will display the text.
const replicant = nodecg.Replicant('bannerText');
replicant.on('change', (value: unknown) => banner.innerHTML = value as string);