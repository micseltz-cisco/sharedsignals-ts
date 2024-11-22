const config = {
    transmitterUrl: 'https://transmitter',
    audience: 'http://example_receiver',
    bearer: '',
    verify: true,
    receiverUrl: 'http://receiver:5003',
    subjects: [{
        "format": "email",
        "email": "user@example.com"
    }],
    port: 5003
};

export default config;