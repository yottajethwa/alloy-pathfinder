# Alloy Pathfinder

Project for testing the best way to navigate paths in Alloy

## Getting Started

Checkout the project open a CLI and issue the following command to run the development server.

```
npm run serve
```

## Commands

The following commands can be used and a description is provided as to what they do.

"serve": "vue-cli-service serve",
"build": "vue-cli-service build",
"lint": "vue-cli-service lint",
"test:unit": "vue-cli-service test:unit",
"deploy": "npm run build && node publishToS3.js"

| Command             | Description                                                                             |
| ------------------- | --------------------------------------------------------------------------------------- |
| `npm run serve`     | Starts the development server                                                           |
| `npm run build`     | Builds the project to `dist/` should be used for publishing                             |
| `npm run lint`      | Lints and auto fixes the vue and typescript files **warning > this can be destructive** |
| `npm run test:unit` | Runs the unit tests for the project                                                     |
| `npm run deploy`    | Builds the project and publishes to AWS S3                                              |
