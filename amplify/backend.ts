// Amplify
import { defineBackend } from '@aws-amplify/backend';

// 認証
import { auth } from './auth/resource';

// データ
import { data } from './data/resource';

// ストレージ
import { storage } from './storage/resource';

// Amplifyのバックエンドを作成
const backend = defineBackend({
  auth,
  data,
  storage,
});

// Cognitoのユーザープール・ユーザープールクライアント・IDプール
const { cfnIdentityPool, cfnUserPool, cfnUserPoolClient } = backend.auth.resources.cfnResources;

// ゲストアクセスを無効化
cfnIdentityPool.allowUnauthenticatedIdentities = false;

// セルフサービスのサインアップを無効化
cfnUserPool.adminCreateUserConfig = {
  allowAdminCreateUserOnly: true,
};

// アクセストークンとIDトークンの有効期限を最短に設定
cfnUserPoolClient.accessTokenValidity = 5;
cfnUserPoolClient.idTokenValidity = 5;
cfnUserPoolClient.tokenValidityUnits = {
  accessToken: 'minutes',
  idToken: 'minutes',
};
