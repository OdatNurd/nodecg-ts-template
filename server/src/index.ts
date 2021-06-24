import { NodeCG } from 'nodecg'

export = (nodecg: NodeCG) => {
  nodecg.log.info('==> Extension started');

  // This will receive messages of this name from all dashboard panels and
  // graphics that send it.
  nodecg.listenFor('message', (msg: string) => {
    nodecg.log.info(`Received msg: ${msg}`);
  });
}