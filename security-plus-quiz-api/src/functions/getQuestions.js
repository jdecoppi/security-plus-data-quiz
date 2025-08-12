const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

app.http('getQuestions', {
    methods: ['GET', 'POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        
        // Set CORS headers
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        };
        
        // Handle OPTIONS request (CORS preflight)
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers,
                body: ""
            };
        }
        
        try {
            // Get Cosmos DB connection info from environment variables
            const endpoint = process.env.COSMOS_ENDPOINT;
            const key = process.env.COSMOS_KEY;
            const databaseId = process.env.COSMOS_DB_NAME;
            const containerId = process.env.COSMOS_CONTAINER_NAME;
            
            // Log environment variables for debugging (remove in production)
            context.log('COSMOS_ENDPOINT:', endpoint);
            context.log('COSMOS_DB_NAME:', databaseId);
            context.log('COSMOS_CONTAINER_NAME:', containerId);
            
            // Create Cosmos client
            const client = new CosmosClient({ endpoint, key });
            const database = client.database(databaseId);
            const container = database.container(containerId);
            
            // Generate random question IDs
            const uniqueNumbers = generateUniqueRandomNumbers(10, 1, 25);
            context.log('Random question IDs:', uniqueNumbers);
            
            // Create query parameters
            const placeholders = uniqueNumbers.map((_, i) => `@id${i}`).join(", ");
            const parameters = uniqueNumbers.map((value, i) => ({ name: `@id${i}`, value }));
            
            // Query to get random questions
            const querySpec = {
                query: `SELECT * FROM c WHERE c.QuestionID IN (${placeholders})`,
                parameters
            };
            
            const { resources: results } = await container.items
                .query(querySpec)
                .fetchAll();
            
            context.log('Query executed successfully, found', results.length, 'results');
            
            return {
                status: 200,
                headers,
                body: JSON.stringify(results)
            };
            
        } catch (error) {
            context.error('Database error:', error);
            
            return {
                status: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Failed to fetch questions', 
                    details: error.message 
                })
            };
        }
    }
});

// Helper function to generate unique random numbers
function generateUniqueRandomNumbers(count, min, max) {
    if (count > (max - min + 1)) {
        throw new Error("Count can't be larger than the range between min and max");
    }

    const uniqueNumbers = new Set();
    while (uniqueNumbers.size < count) {
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        uniqueNumbers.add(randomNumber);
    }
    return Array.from(uniqueNumbers);
}