// Amplify
import {
  a,
  type ClientSchema,
  defineData,
} from '@aws-amplify/backend';

// スキーマを定義
const schema = a.schema({
  Transcription: a.model({
    userId: a.string().required(),
    summary: a.string().required(),
    s3Key: a.string().required(),
  })
    .authorization((allow) => [
      allow.authenticated(),
    ]),
});

// スキーマを公開
export type Schema = ClientSchema<typeof schema>;

// リソースを作成
export const data = defineData({
  schema,
});
