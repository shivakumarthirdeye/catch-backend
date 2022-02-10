module.exports = {
  apps: [
    {
      name: "catch_api",
      script: "./build/src/main.js",
      exec_mode: "cluster",
      instances: 1,
      env: {
        PORT: 8080,
      },
      env_production: {
        NODE_ENV: "production",
        PM2_PUBLIC_KEY: "iecl4bi6eonglav",
        PM2_SECRET_KEY: "o2l1oyi0yztca3a",
        DB_URL:
          "mongodb+srv://heavell:123@catch.8r9rg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        SIGNING_KEY: "234234asdfq234xzdcqw342342czsfd23",
        AWS_ACCESS_KEY_ID: "AKIA6GXLJLSIMNN3YKXD",
        AWS_SECRET_ACCESS_KEY: "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",
        AWS_S3_BUCKET_NAME: "shiv3eye",
      },
      env_development: {
        NODE_ENV: "production",
        PM2_PUBLIC_KEY: "iecl4bi6eonglav",
        PM2_SECRET_KEY: "o2l1oyi0yztca3a",
        DB_URL:
          "mongodb+srv://heavell:123@catch.8r9rg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
        SIGNING_KEY: "234234asdfq234xzdcqw342342czsfd23",
        AWS_ACCESS_KEY_ID: "AKIA6GXLJLSIMNN3YKXD",
        AWS_SECRET_ACCESS_KEY: "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",
        AWS_S3_BUCKET_NAME: "shiv3eye",
      },
    },
  ],
};
