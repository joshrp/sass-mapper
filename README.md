Sass Mapper
-----------

Dependency tree builder for sass projects

Exmaple 
=======
An example run from the `fixtures/standard` directory of this project
```json
{
  "_page1.scss": [
    "partials/page1/_banner.sass",
    "partials/page1/_content.scss",
    "partials/page1/_footer.scss"
  ],
  "global.scss": [],
  "main.scss": [
    "utils/_tool.scss",
    "_page1.scss"
  ],
  "utils/_common.scss": [],
  "utils/_tool.scss": [
    "utils/_common.scss",
    "utils/global.scss"
  ],
  "utils/global.scss": [],
  "partials/list/_main.scss": [
    "global.scss"
  ],
  "partials/page1/_banner.sass": [],
  "partials/page1/_content.scss": [
    "partials/list/_main.scss"
  ],
  "partials/page1/_footer.scss": []
}
```

Usage
=====
Pass the path to some files you want mapping. Everything file in the directory will be mapped.

`node ./src/main.js fixtures/standard`