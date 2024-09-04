import axios from 'axios'
const BASE = 'https://api.acetaxisdorset.co.uk'

export async function login(username, password) {
    const url = BASE + '/api/UserProfile/Login'

    const response = await axios.post(url, {        
        username: username,
        password: password,
    })
    
    return response.data;
}