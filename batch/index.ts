import "dotenv/config";

import { deletePreviousUsersAndUserSkill } from '../src/lib/supabaseFunction';

const deleteBatchProcess = async () => {
    await deletePreviousUsersAndUserSkill();
}

deleteBatchProcess().then(() => {
    console.log("Batch process successfully.");
}).catch((error) => {
    console.error("Batch process failed!", error);
})
