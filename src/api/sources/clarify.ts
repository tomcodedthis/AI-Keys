export async function clarifyRequest() {
    const raw = JSON.stringify({
        "user_app_id": {
        "user_id": "clarifai",
        "app_id": "main"
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": "https://samples.clarifai.com/dog2.jpeg"
                    },
                },
            }
        ]
    });
    
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + "47b73a7123ca4ff098dca48e3663f612"
        },
        body: raw
    };
    
    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    await fetch(`https://api.clarifai.com/v2/models/general-image-recognition-vit/versions/1bf8b41a7c154eaca6203643ff6a75b6/outputs`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}