import { run } from './runTest';

run().catch(err => {
    console.error(err);
    process.exit(1);
});