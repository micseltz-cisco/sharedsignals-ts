import axios from 'axios';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

interface Config {
    transmitterUrl: string;
    audience: string;
    bearer: string;
    verify: boolean;
    receiverUrl: string;
    subjects: any[];
    port: number;
}

export class TransmitterClient {
    private transmitterUrl: string;
    private audience: string;
    // private auth: { Authorization: string };
    private ssfConfig: any;
    private streamConfig: any;
    private jwks: any;

    constructor(transmitterUrl: string, audience: string) {
        this.transmitterUrl = transmitterUrl;
        this.audience = audience;
        // this.auth = { Authorization: `Bearer ${bearer}` };
        // console.log('Bearer:', bearer);
    }

    async getEndpoints() {
        const response = await axios.get(`${this.transmitterUrl}/.well-known/ssf-configuration`);
        console.log('SSF Configuration:', response.data);
        this.ssfConfig = response.data;
    }

    async getJwks() {
        const response = await axios.get(this.ssfConfig.jwks_uri);
        console.log('JWKS:', response.data);
        this.jwks = jwksClient({
            jwksUri: this.ssfConfig.jwks_uri
        });
        console.log('JWKS Client:', this.jwks);
    }

    async decodeBody(body: string) {
        console.log('Decoding body:', body);
        const decodedHeader = jwt.decode(body, { complete: true, });
        if (!decodedHeader) {
            throw new Error('Invalid JWT');
        }
        const kid = decodedHeader.header.kid;
        const key = await this.jwks.getSigningKey(kid);
        const signingKey = key.getPublicKey();
        return jwt.verify(body, signingKey, {
            algorithms: [decodedHeader.header.alg as jwt.Algorithm],
            issuer: this.ssfConfig.issuer,
            audience: this.audience
        });
    }

    // async configureStream(endpointUrl: string) {
    //     console.log('Configuring stream with endpoint:', endpointUrl);
    //     console.log('SSF Configuration:', this.ssfConfig);
    //     const response = await axios.post(this.ssfConfig.configuration_endpoint, {
    //         delivery: {
    //             method: 'https://schemas.openid.net/secevent/risc/delivery-method/push',
    //             endpoint_url: endpointUrl
    //         },
    //         events_requested: [
    //             'https://schemas.openid.net/secevent/risc/event-type/credential-compromise'
    //         ]
    //     }, { headers: this.auth });
    //     this.streamConfig = response.data;
    // }

    // async addSubject(subject: any) {
    //     console.log('Adding subject:', subject, 'to SSF', this.ssfConfig.add_subject_endpoint);
    //     await axios.post(this.ssfConfig.add_subject_endpoint, { subject }, { headers: this.auth });
    //     console.log('Subject added:', subject);
    // }

    // async requestVerification() {
    //     await axios.post(this.ssfConfig.verification_endpoint, { state: require('crypto').randomBytes(16).toString('hex') }, { headers: this.auth });
    // }
}