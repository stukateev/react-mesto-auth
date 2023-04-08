class Auth {
    constructor() {
        this._baseURL = 'https://auth.nomoreparties.co'
        this._headers = {'Content-Type': 'application/json'}
    }
    _checkResponse(res){
        if(res.ok){
            return res.json()
        }
        console.log(res);
        return Promise.reject(`Бип-Буп-Бип! Что-то пошло не так. Статус: ${res.status} ${res}`)
    }
    authorization(data) {
        return fetch(`${this._baseURL}/signin`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                password: data.password,
                email: data.email,
            }),
        })
            .then(this._checkResponse)
    }
    registration(data) {
        return fetch(`${this._baseURL}/signup`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                password: data.password,
                email: data.email,
            })
        })
            .then(this._checkResponse)
    }

    checkToken(token) {
        return fetch(`${this._baseURL}/users/me`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(this._checkResponse)
    }
}
const auth = new Auth();
export { auth }