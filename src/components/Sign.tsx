import { SignRequest } from "../models/SignRequest";
import { useEffect, useState } from "react";

function Sign() {
    const [requestSign, setRequestSign] = useState<SignRequest | undefined>();
    const [redirectUrl, setRedirectUrl] = useState('');
    const queryParameters = new URLSearchParams(window.location.search);
    const idParams = queryParameters.get("id");
    const methodParams = queryParameters.get("method");
    const dataParams = queryParameters.get("data");
    const deepLinkParams = queryParameters.get("deepLink");
    const toParams = queryParameters.get("to");
    const valueParams = queryParameters.get("value");

    useEffect(() => {
        if (idParams && window.ethereum) {
            constructCall(idParams);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idParams]);


    const constructCall = async (id: string) => {
        const callAccount = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = callAccount[0];
        let call: SignRequest | null = null;
        if (methodParams && methodParams.indexOf('sign') > -1) {
            call = {
                id: id,
                deepLink: deepLinkParams!,
                jsonRpc: "2.0",
                message: {
                    id: id,
                    method: methodParams!,
                    jsonrpc: "2.0",
                    from: address,
                    params: [address, dataParams]
                },
                result: ""
            };
        } else {
            call = {
                id: id,
                deepLink: deepLinkParams!,
                jsonRpc: "2.0",
                message: {
                    id: id,
                    method: methodParams!,
                    jsonrpc: "2.0",
                    from: address,
                    params: [{
                        data: dataParams,
                        to: toParams,
                        from: address,
                        value: valueParams
                    }]
                },
                result: ""
            };
        }

        if (call) {
            getsign(call);
        }
    };

    const getsign = async (data: SignRequest) => {
        setRequestSign(data);
        const parsedJson = data.message;
        try {
            console.log("parsedJson", parsedJson);
            const result = await window.ethereum.request(parsedJson);
           // openLink(`${data.deepLink}?result=${result}&id=${parsedJson.id}`);

            setRedirectUrl(`${data.deepLink}?result=${result}&id=${parsedJson.id}`);
        }
        catch (e: any) {
           // openLink(`${data.deepLink}?error=${encodeURIComponent(e?.message)}& id=${parsedJson.id}`);
            setRedirectUrl(`${data.deepLink}?error=${encodeURIComponent(e?.message)}& id=${parsedJson.id}`);
        }
    };

    const connect = async () => {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
    }

    const openLink = (link: string) => {
        window.open(link, '_blank', 'noreferrer');
    };

    const redirect = () => {
        openLink(redirectUrl);
    };



    return (
        <div>
            {requestSign ?
                <div>{JSON.stringify(requestSign)}</div>
                :
                window.ethereum ?
                    <div> Wait time overflow </div>
                    :
                    <div> Metamask not detected</div>
            }
            <div>
                <button onClick={() => connect()}>Connect</button>
                <button onClick={() => redirect()}>Redirect</button>
            </div>
        </div>
    );
}

export default Sign;
