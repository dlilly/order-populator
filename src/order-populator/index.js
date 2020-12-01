const _ = require('lodash')

module.exports = {
    asyncInit: async() => {
    },
    scheduled_jobs: [{
        key: 'order-populator',
        frequency: 300000,
        job: async (ct, jobId) => {
            let perPage = _.random(1, 5)
            let products = await ct.productProjectionsSearch.read({ 
                perPage, 
                priceCurrency: 'USD', 
                priceCountry: 'US',
                markMatchingVariants: true
            })

            try {
                let cart = await ct.carts.post({
                    currency: 'USD',
                    shippingAddress: { country: 'US' },
                    lineItems: _.map(products, product => ({
                        sku: product.masterVariant.sku,
                        quantity: _.random(1, 5)
                    }))
                })
    
                let order = await ct.orders.post({
                    id: cart.id,
                    version: cart.version,
                    orderNumber: jobId,
                    orderState: 'Complete',
                    paymentState: 'Paid'
                })
                logger.info(`[ ${jobId} ] Order [ ${order.orderNumber} ] created with ${cart.lineItems.length} line items`)
            } catch (error) {
                logger.error(`Error creating order`)
                logger.error(error)
            }
        }
    }],
    extensions: [{
        key: 'cart-extension',
        path: '/api/cartUpdate',
        triggers: {
            cart: {
                Update: async ({ data, ct }, res, next) => {
                }
            }
        }
    }]
}