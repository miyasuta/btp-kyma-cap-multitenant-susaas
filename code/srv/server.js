const cds = require('@sap/cds');
const cdsSwagger = require('cds-swagger-ui-express');
const odatav2adapterproxy = require('@sap/cds-odata-v2-adapter-proxy');

cds.on('bootstrap', async (app) => {
        
    app.get('/healthz', (_, res) => {
        res.status(200).send('OK')
    });

    app.use(cdsSwagger({ "basePath": "/swagger", "diagram": "true"}));
    app.use(odatav2adapterproxy());    
});

cds.on('served', async () => {
    const { 'cds.xt.SaasProvisioningService': provisioning } = cds.services

    // Add provisioning logic if only multitenancy is there
    if(provisioning){
        let tenantProvisioning = require('./provisioning');
        provisioning.prepend(tenantProvisioning);
    }else{
        console.log("There is no service, therefore does not serve multitenancy!");
    }
});

cds.on('listening', async (server, url) => {
    const LOG = cds.log('cds.serve|server',{label:'cds'}); if (!LOG._info) return; else log = LOG.info
    const flpUrl = server.url + '/#Shell-home';
    LOG.info ('mock launchpad listening on', {flpUrl})
});
  
module.exports = cds.server;