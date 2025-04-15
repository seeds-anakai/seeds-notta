// Amplify
import {
  defineAuth,
  secret,
} from '@aws-amplify/backend';

// 環境変数
const {
  AWS_APP_ID,
  AWS_BRANCH,
  CUSTOM_DOMAIN,
} = process.env;

// リソースを作成
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        scopes: [
          'email',
          'openid',
          'profile',
        ],
        attributeMapping: {
          email: 'email',
          fullname: 'name',
          profilePicture: 'picture',
          custom: {
            email_verified: 'email_verified',
          },
        },
      },
      callbackUrls: [
        CUSTOM_DOMAIN ? `https://${CUSTOM_DOMAIN}/` : (AWS_APP_ID && AWS_BRANCH ? `https://${AWS_BRANCH.replace(/\W|_/g, '-')}.${AWS_APP_ID}.amplifyapp.com/` : 'http://localhost:3000/'),
      ],
      logoutUrls: [
        CUSTOM_DOMAIN ? `https://${CUSTOM_DOMAIN}/` : (AWS_APP_ID && AWS_BRANCH ? `https://${AWS_BRANCH.replace(/\W|_/g, '-')}.${AWS_APP_ID}.amplifyapp.com/` : 'http://localhost:3000/'),
      ],
    },
  },
});
