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
import DeliveryController from './app/controllers/DeliveryController'
import DeliveriesController from './app/controllers/DeliveriesController'

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
// Deliveries routes
Routes.get('/deliveries', DeliveryController.index)
Routes.post('/deliveries', DeliveryController.store)
Routes.put('/deliveries/:delivery/:id', DeliveryController.update)
// Deliveries routes
Routes.get('/:id/deliveries/:finalized', DeliveriesController.index)

export default Routes
