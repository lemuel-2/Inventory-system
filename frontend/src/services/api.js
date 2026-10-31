class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async get(path) {
        const response = await fetch(`${this.baseURL}${path}`)
        const result = await response.json()
        if(!response.ok) throw new Error(result.error?.message || "Something went wrong");
        
        return result.data;
    }
}

const api = new ApiClient("http://localhost:3000/api");

export default api