self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "rootMainFilesTree": {},
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/acceptmembers": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/acceptmembers.js"
    ],
    "/login": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/login.js"
    ],
    "/memberpage": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/memberpage.js"
    ],
    "/orglist": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/orglist.js"
    ],
    "/orgpage": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/orgpage.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];