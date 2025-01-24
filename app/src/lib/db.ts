import PocketBase from 'pocketbase';

// Use the environment variable or fallback for development
const apiUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090';
const pb = new PocketBase(apiUrl);

export default pb;
