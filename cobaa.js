const axios = require('axios').default;

const baseUrl = "https://www.thejakartapost.com"


const getContentHtml = async (path) => {
    try {
        const res = await axios.get(`${baseUrl}/${path}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
            }
        })
        console.log("tes", res)
    } catch (err) {
        console.log(err)
    }
}


const execution = () => {
    getContentHtml('/business/companies')
}


execution()