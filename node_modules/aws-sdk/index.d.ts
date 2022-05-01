import {GlobalConfigInstance} from 'aws-sdk/lib/config';

export * from 'aws-sdk/lib/core';
export * from 'aws-sdk/clients/all';
export var config: GlobalConfigInstance

export as namespace AWS;