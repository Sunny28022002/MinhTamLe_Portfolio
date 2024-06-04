import { getToken } from './helpers'
export const AVATAR_API = 'https://ui-avatars.com/api'
// Config port
export const API = 'https://localhost:5003/apigateway'
export const Auth_API = 'https://localhost:5003/apigateway/Auth'
export const Episode_API = 'https://localhost:5003/apigateway/Episodes'
export const Movie_API = 'https://localhost:5003/apigateway/Movies'
export const Category_API = 'https://localhost:5003/apigateway/Categories'
export const Comment_API = 'https://localhost:5003/apigateway/Comment'

// export const API = 'http://localhost:44388/api'
// export const Auth_API = 'http://localhost:44388/api/Auth'
// export const Episode_API = 'http://localhost:44384/api/Episodes'
// export const Movie_API = 'http://localhost:44384/api/Movies'
// export const Category_API = 'http://localhost:44386/api/Categories'
// export const Comment_API = 'http://localhost:44384/api/Comment'

// Config token
export const AUTH_TOKEN = 'authToken'
export const USER_ID = 'user_Id'
export const REFRESH_TOKEN = 'refreshToken'
export const BEARER = 'Bearer'
export const headerConfig = { 'Access-Control-Allow-Origin': '*' }
// export const headerConfigWithToken = {
//     'Access-Control-Allow-Origin': '*',
//     'Authorization': `Bearer ${getToken()}`,
// }
