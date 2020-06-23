import { Router } from 'express'
import multer from 'multer'
// Configs
import multerAvatarConfig from './config/multerAvatar'
import multerSignatureConfig from './config/multerSignature'
// Middlewares
import AuthMiddleware from './app/middlewares/Auth'
// Controllers
import SessionController from './app/controllers/SessionController'
import RecipientController from './app/controllers/RecipientController'
import AvatarController from './app/controllers/AvatarController'
import SignatureController from './app/controllers/SignatureController'
import DeliverymanController from './app/controllers/DeliverymanController'
import OrderController from './app/controllers/OrderController'

const Routes = new Router()

const uploadAvatar = multer(multerAvatarConfig)
const uploadSignature = multer(multerSignatureConfig)

// ROUTES ;
Routes.post('/sessions', SessionController.store)

// Authentication middleware
Routes.use(AuthMiddleware)

/* 
||   Authenticated routes
*/

// Uploads routes
Routes.post('/avatars', uploadAvatar.single('file'), AvatarController.store)
Routes.post(
  '/signatures',
  uploadSignature.single('file'),
  SignatureController.store
)
// Recipients routes
Routes.post('/recipients', RecipientController.store)
// Deliverymans routes
Routes.get('/deliverymans', DeliverymanController.index)
Routes.post('/deliverymans', DeliverymanController.store)
Routes.put('/deliverymans/:id', DeliverymanController.update)
Routes.delete('/deliverymans/:id', DeliverymanController.delete)
// Orders routes
Routes.get('/orders/:id', OrderController.index)
Routes.post('/orders', OrderController.store)
Routes.get('/orders/:delivery/:id', OrderController.update)

export default Routes
