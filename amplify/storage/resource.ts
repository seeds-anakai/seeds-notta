// Amplify
import { defineStorage } from '@aws-amplify/backend';

// リソースを作成
export const storage = defineStorage({
  name: 'transcriptions',
  access: (allow) => ({
    'transcriptions/{entity_id}/*': [
      allow.entity('identity').to([
        'read',
        'write',
        'delete',
      ]),
    ],
  }),
});
