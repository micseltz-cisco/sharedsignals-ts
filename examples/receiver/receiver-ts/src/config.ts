const config = {
    transmitterUrl: 'https://ssf.caep.dev',
    audience: 'https://fhjl767rya3ci4gu727yvonf2i0gnqes.lambda-url.us-east-2.on.aws/',
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