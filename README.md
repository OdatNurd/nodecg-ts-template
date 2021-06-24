NodeCG Bundle TypeScript Template
---------------------------------

This is a very simple template for creating [NodeCG](http://github.com/nodecg/nodecg)
bundles using TypeScript. This features using [WebPack](https://webpack.js.org/)
to "bundle" (pun mildly intended) all code for the extension, dashboard panels
and graphics into a single script file.


## What is NodeCG?

NodeCG is a system that allows you to make broadcast graphics using Node.JS,
allowing you to leverage readily available technologies to generate graphics
for live broadcasts, live streams, and so on. Historically something like this
would require expensive, dedicated equipment; NodeCG leverages the display
capabilities of web technology to allow you to create real time graphics with
off the shelf tools.

In a nutshell, NodeCG allows you to easily synchronize code running on a
server, a user facing dashboard and web pages displaying their content live
(e.g. a browser source in [OBS](https://obsproject.com/)) by allowing all parts
to seamless communicate with each other across the server, client and stream
boundary.


## Getting Started

In order to use this template, you need a running instance of NodeCG. This
section assumes that you're new to this and walks you through the entire
process. If you're already familiar with NodeCG you can skip to the next
section. Similarly, if you already have a running NodeCG instance, you can skip
that setup step.

### Install NodeCG

[NodeCG](http://github.com/nodecg/nodecg) is a complete web application that
will be running its own web server; the first step is to install it. This guide
will be installing  via `git`; there is also a `nodecli` script available as
well, but this guide does not cover that.


1. `cd somelocation` to go to the location you want to install `NodeCG` in
2. `git clone https://github.com/nodecg/nodecg.git` to clone the repository
3. `cg nodecg` and `git checkout v1.8.1` ; this step checks out the specific
   tagged version you would like to run. As of the time of this writing,
   `1.8.1` is the latest version, but there may be a newer one available.
4. `npm init` to download all packages and get `NodeCG` ready to run.


### Set up our bundle

`NodeCG` works on the concept of `bundles`, which are special `node` packages
that contain functionality in the form of an `extension`, `panels` and
`graphics` that communicate with each other to allow you to create and control
the display of live graphics.

1. `cd bundles` to go into the `nodecg` bundles directory
2. `git clone https://github.com/OdatNurd/nodecg-ts-template.git my-bundle` to
   clone the repository and put the bundle in place; choose any name you like
   for this.
3. `cd my-bundle` to go into the bundle, then `yarn init` and `yarn build` to
   download the appropriate packages and run `webpack` to build all of the
   code out.

     **NOTE:** I use `yarn` instead of `npm`, which is why there is a
               `yarn.lock` file present. You can remove that and use `npm` if
               you prefer.

At this point, `extension.js` should be created, which contains the code that
will run on the server side, while `dashboard/script/` and `graphics/script/`
will contain the code that runs in the dashboard panel and graphic respectively.


### Testing things out

To verify that everything works, we can fire up our `NodeCG` instance and see
things in action.

1. `cd ../..` to go back to the `nodecg` installation folder
2. `node index.js` will start the server running. You should see something like
   the following; the `[my-bundle]` log line is visible in the code in the
   `extension`.

    [nodecg] No config found, using defaults.
    info: [nodecg/lib/server] Starting NodeCG 1.8.1 (Running on Node.js v14.15.4)
    info: [my-bundle] ==> Extension started
    info: [nodecg/lib/server/extensions] Mounted my-bundle extension
    info: [nodecg/lib/server] NodeCG running on http://localhost:9090

3. Open a browser on http://localhost:9090, which will show you the NodeCG
   dashboard, where you should see a panel with a simple form in it.
4. Check the browser console; you should see a log indicating that the dashboard
   panel loaded; the code for this log line is visible in the code in the
   `panel`.
5. Click the button `Transmit a sample message`; the browser console should log
   that a message was transmitted, and you should see it being received by the
   server:

    info: [template] Received msg: I am a sample message

6. At the top right of the screen, click on `graphics` to view the graphics
   available from this bundle. You should see a single graphic named `overlay/index.html`
   with a `0` next to it; this is the number of copies of this graphic that are
   currently loaded. Click the link to open the graphic.
7. Check the browser console; you should see a log indicating that the graphic
   `overlay` has loaded; the code for this is in the `overlay`.
8. In the dashboard, there should now be a `1` next to `overlay.html`; there is
   now one copy of it loaded and connected to the server.
9. Click on `workspace` to go back to the dashboard; enter some text in the
   field and click `Display`
10. In the loaded `graphic`, the text is now visible in a banner across the
    top of the screen.


### Bundles

In NodeCG, functionality is "slotted in" in the form of a `Bundle`; this is a
NodeJS package containing an `extension`, one or more `panels` and one or more
`graphics`. Bundles are installed into a NodeCG instance, allowing you to
easily mix and match functionality.

Each of the three parts of the bundle; `extension`, `panel` and `graphic` are
connected together internally by NodeCG, and via the API they can
intercommunicate with each other,


#### Extension

Each NodeCG bundle contains exactly one `extension`, which is code that runs on
the back end server directly inside of a running instance of NodeCG. This takes
the form of either a file named `extension.js` in the root of the bundle, or a
folder named `extension` which contains (at a minimum) an `index.js` file/

When the bundle is mounted, NodeCG will import either of those two files and
expect them to export a single function which kicks off the functionality of
the server side of the bundle (if any). The function is invoked with a single
parameter of `nodecg` which provides access to the NodeCG API.


#### Panels

A NodeCG bundle can contain any number of `panels`; these are web pages that
will appear in the NodeCG dashboard for you to interact with. Each is rendered
inside of an `iframe` to keep each one self contained.

Inside of the panel, a global `nodecg` object is available to allow access to
the client side portion of the NodeCG API.


#### Graphics

A NodeCG bundle can contain any number of `graphics` (though usually at least
one); these are web pages that are overlaid on the eventual broadcast source
(e.g. loaded in a Browser source in [OBS](https://obsproject.com/)).

Like a `panel`, a `graphic` has access to a global `nodecg` object to allow
access to the NodeCG API.


#### Messages

Each of the three parts of `NodeCG`; `extension`, `panel` and `graphic` have
access to the NodeCG API. One of the things this allows is transmitting a
message to other interested parties. This can be done in any of these places,
and the message will be delivered to anyone that's listening.

In the example above, a `message` is used to transmit something from the
dashboard `panel` to the `extension` running on the server. Here the text is
simply displayed, but this could also trigger some action or request for data
which could be later returned via a different message.

Remember; the graphic can also transmit and receive messages as well, so this
mechanism can be used to communicate information to and from graphic, allowing
you to control what it displays.


#### Replicants

A `Replicant` is an object that can be constructed via the `NodeCG` API and
makes it easy to synchronize information between the `extension`, `panels` and
`graphics`.

In use, you construct a `Replicant` giving it a specific name; you would do
this in at least two places (e.g. in a `panel` and in a `graphic`). Whenever
the value of a `Replicant` changes, `NodeCG` automagically synchronizes the new
value with all other instances of `Replicant` with the same name.

In the example above, a Replicant is used to tell the `graphic` to display the
text entered in the `panel`; when you click the button, the code in the panel
updates the value of the `Replicant`, and the `graphic` is immediately receives
an update.

This is similar to using a `message`, but much easier for cases when the
information being transmitted is going to be used directly for display.
