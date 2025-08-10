const { app } = require('@azure/functions');
const mysql = require('mysql2/promise');

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
            // Log environment variables for debugging
            context.log('DB_HOST:', process.env.DB_HOST);
            context.log('DB_USER:', process.env.DB_USER);
            context.log('DB_NAME:', process.env.DB_NAME);
            
            // Get database connection info from environment variables
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                ssl: process.env.DB_SSL === 'true' ? {rejectUnauthorized: true} : false
            });
            
            context.log('Connected to database successfully');
            
            // Query to get random questions
            const [results] = await connection.query(
                'SELECT * FROM dataquestions ORDER BY RAND() LIMIT 10'
            );
            
            context.log('Query executed successfully, found', results.length, 'results');
            
            await connection.end();
            
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