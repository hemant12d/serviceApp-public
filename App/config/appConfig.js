// Default configuations applied to all environments
const appConfig = {
    IMG_FOLDER: `uploads/`,
    DOC_LIMIT: 10,
    PREFIX: 'api/v1/',
    APP_ROLES: ['admin', 'user'],
    FILE_SUPPORTED: ['jpg', 'jpeg', 'png'],
    APP_TYPE: ['service', 'product'],
    DEFAULT_CART_TYPE: 'product',
    PAYMENT_ACCEPTED_TYPE: ['cod', 'upi', 'netbanking', 'card'],
    ORDER_STATUS: ['pending', 'approved', 'assigned', 'delivered', 'picked', 'inprogress', 'delivered', 'cancel'],
    ORDER_DELIVERY_TYPE:['delivery']
};


export default appConfig;