const path = require('path');

/* This defines the part of a WebPack configuration that is common to all of
 * the export targets that are available. */
const rootConfig = {
  mode: process.env.NODE_ENV || 'development',

  resolve: {
    extensions: ['.ts', '.js'],
  },

  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  }
}

/* Generate and return the rules used to build the server side extension in the
 * root of the package.
 *
 * This builds as a umd library because NodeCG requires that the export be a
 * single function as would be accessible via a standard require(), which it
 * will then call to give the extension its API instance. */
function buildExtension() {
  return {
    name: 'extension',
    entry: './server/src/index.ts',
    output: {
      filename: 'extension.js',
      path: path.resolve(__dirname),

      // Important; this needs to be a umd library or it won't export a function
      // and nodecg will poop its pants.
      library: {
        type: 'umd',
      }
    },

    ...rootConfig
  }
}

/* Generate and return the rules used to build a panel with the given name.
 *
 * All panels are expected to live in a folder named for themselves under the
 * 'dashboard' directory; the name you provide here is the name of the panel
 * to be built. */
function buildPanel(panelName) {
  return {
    name: panelName,
    entry: `./dashboard/${panelName}/src/index.ts`,
    output: {
      filename: 'script.js',
      path: `${path.resolve(__dirname)}/dashboard/${panelName}/js/`
    },

    ...rootConfig
  }
}

/* Generate and return the rules used to build a graphic with the given name.
 *
 * All graphics are expected to live in a folder named for themsleves under the
 * 'graphics' directory; the name you provide here is the name of the graphic
 * to be built. */
function buildGraphic(overlayName) {
  return {
    name: overlayName,
    entry: `./graphics/${overlayName}/src/index.ts`,
    output: {
      filename: 'script.js',
      path: `${path.resolve(__dirname)}/graphics/${overlayName}/js/`
    },

    ...rootConfig
  }
}

module.exports = [
  /* This configuration is for the server side extension. This needs to be
   * either a single file named extension.js OR a file named extension/index.js;
   * nodecg will only try to load one of those. */
   buildExtension(),

  /****************************************************************************/

  /* This section contains the configurations for building scripts associated
   * with dashboard panels. These are pages that run in a client side web
   * browser. */

  /* The dashboard panel named 'panel'. */
  buildPanel('panel'),

  /****************************************************************************/

  /* This section contains the configurations for building scripts associated
   * with graphics. These are pages that run in browser sources in OBS. */

  /* The graphic named 'overlay'. */
  buildGraphic('overlay'),
];