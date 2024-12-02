import express from 'express';
import bodyParser from 'body-parser';
import { TransmitterClient } from './client';
import config from './config';
import getRawBody from 'raw-body';
import serverless from 'serverless-http';


import axios from 'axios';

const app = express();
app.use(bodyParser.json());

let client: TransmitterClient;

async function initializeClient() {
    try {

        // if (!config.bearer) {
        //     const reg = await axios.post(`${config.transmitterUrl}/register`, {
        //         audience: config.audience
        //     });
        //     config.bearer = reg.data.token;
        // }
        client = new TransmitterClient(config.transmitterUrl, config.audience);

        await client.getEndpoints();
        await client.getJwks();
        // await client.configureStream(`${config.receiverUrl}/event`);
        // for (const subject of config.subjects) {
        //     await client.addSubject(subject);
        // }
    } catch (error) {
        console.error('Error initializing client:', error);
    }
}

app.post('/event', async (req, res) => {
    await initializeClient();
    try {
        const event = await client.decodeBody((await getRawBody(req)).toString());
        console.log(JSON.stringify(event, null, 2));
        res.sendStatus(202);
    } catch (error) {
        console.error('Error processing event:', error);
        res.sendStatus(500);
    }
});

// app.get('/request_verification', async (req, res) => {
//     try {
//         console.log('Requesting verification event');
//         await client.requestVerification();
//         res.send('Submitted request for verification event');
//     } catch (error) {
//         console.error('Error requesting verification:', error);
//         res.sendStatus(500);
//     }
// });

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});

const serverlesHander = serverless(app);

export const handler = async (event: Object, context: Object) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    return serverlesHander(event, context);
}