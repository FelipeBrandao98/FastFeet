import { Router } from 'express'

import AuthMiddleware from './app/middlewares/Auth'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import RecipientController from './app/controllers/RecipientController'

const Routes = new Router()

// ROTAS ;
Routes.post('/users', UserController.store)
Routes.post('/sessions', SessionController.store)

// Middleware de autenticação
Routes.use(AuthMiddleware)

// Rotas autenticadas
Routes.post('/recipients', RecipientController.store)

export default Routes
