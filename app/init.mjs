import PocketBase from 'pocketbase';

const apiUrl = 'http://pocketbase:8090';
const pb = new PocketBase(apiUrl);

const ADMIN_EMAIL = "nilltill05@gmail.com";
const ADMIN_PASSWORD = "nani171717";

async function getUsersCollectionId() {
    try {
        console.log("henter alle collections...");
        const collections = await pb.collections.getFullList();

        // Find the "users" collection
        const usersCollection = collections.find(c => c.name === "users");
        if (!usersCollection) {
            throw new Error("kunne ikke finne users collection!");
        }

        console.log(`fant users collection ID: ${usersCollection.id}`);
        return usersCollection.id;
    } catch (e) {
        console.error("kunne ikke hente collection:", e);
    }
}

async function waitForPocketBase() {
    let retries = 0;
    const maxRetries = 30;

    while (retries < maxRetries) {
        try {
            console.log(`Sjekker PocketBase (${apiUrl}/api/health)...`);
            const response = await fetch(apiUrl + "/api/health");
            if (response.ok) {
                console.log("PocketBase er klar!");
                return;
            }
        } catch (e) {
            console.error(`Feil: ${e.message}`);
        }

        console.log("⏳ Venter på PocketBase...");
        retries++;
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error("PocketBase ble ikke startet i tide!");
}

async function setupSuperUser() {
    try {
        console.log("Logger inn som superbruker...");

        // Bruker `_superusers`-samlingen for autentisering
        await pb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        
        console.log("Superbruker innlogging vellykket.");
    } catch (e) {
        console.error("Superbruker innlogging feilet, sjekk legitimasjon.", e);
        return;
    }
}


async function createTodosCollection() {
    try {
        console.log("Henter eksisterende samlinger...");
        const collections = await pb.collections.getFullList();

        const collectionName = "todos";
        if (collections.some(c => c.name === collectionName)) {
            console.log(`Samlingen '${collectionName}' eksisterer allerede.`);
            return;
        }

        let collectionIdUsers = await getUsersCollectionId();

        console.log(`🛠 Oppretter samlingen '${collectionName}'...`);
        await pb.collections.create({
            name: collectionName,
            type: "base",
            fields: [
                {
                    name: "description",
                    type: "text",
                    required: true,
                    max: 10,
                },
                {
                    name: "user",
                    type: "relation",
                    required: true,
                    maxSelect: 1,
                    collectionId: collectionIdUsers,
                    cascadeDelete: true,
                },
            ],
            listRule: "",
            viewRule: "",
            createRule: "",
            updateRule: "",
            deleteRule: ""
        });

        console.log("Samlingen todos ble opprettet");
    } catch (e) {
        console.error("kunne ikke opprette samlingen:", e);
    }
}

// 🚀 Kjør oppsettet
(async () => {
    await waitForPocketBase();
    await setupSuperUser();
    // await updateSuperUsersCollectionRules();
    await createTodosCollection();
    console.log("Oppsett fullført!");
})();
