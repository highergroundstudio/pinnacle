import PocketBase from 'pocketbase';

// Use environment variable or fallback to localhost
const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(POCKETBASE_URL);

export type AuthModel = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
};

export const getCurrentUser = () => {
  return pb.authStore.model as AuthModel | null;
};