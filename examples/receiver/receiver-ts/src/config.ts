const config = {
    transmitterUrl: 'https://localhost:443',
    audience: 'http://example_receiver',
    bearer: '',
    verify: true,
    receiverUrl: 'http://localhost:3000',
    subjects: [{
        "format": "email",
        "email": "user@example.com"
    }],
    port: 3000
};

export default config;