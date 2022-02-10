declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV?: 'development' | 'production' | 'local',
        PORT?: string,
        PM2_PUBLIC_KEY?: string,
        PM2_SECRET_KEY?: string,
        DB_URL?: string,
        SIGNING_KEY?: string,
        AWS_ACCESS_KEY_ID?: string,
        AWS_SECRET_ACCESS_KEY?: string,
        AWS_S3_BUCKET_NAME?: string
    }
}