class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(path, option = {}) {
    const response = await fetch(`${this.baseURL}${path}`, {
      ...option,
      headers: {
        "Content-Type": "application/json",
        ...option.headers,
      },
    });

    const result = await response.json();

    if (!response.ok)
      throw new Error(result.error?.message || "Something went wrong");

    return result.data;
  }

  async get(path) {
    return this.request(path);
  }

  async post(path, data) {
    return this.request(path, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async patch(path, data) {
    return this.request(path, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}

const api = new ApiClient("http://localhost:3000/api");

export default api;
