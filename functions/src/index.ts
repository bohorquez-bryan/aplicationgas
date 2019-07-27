import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp();


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// funciones de pedidos al norte
exports.orderIsAcceptedNorth = functions.firestore
    .document('orderGas/Norte/pedidos/{pedidoID}')
    .onUpdate(async event =>{
        const dataOrderbefore = event.before.data();
        const dataOrderAfter = event.after.data();

        console.log(JSON.stringify(dataOrderbefore))
        console.log(JSON.stringify(dataOrderAfter))

        if(dataOrderAfter.state == "Aceptado"){
            const db = admin.firestore()

            const distriRef = db.collection('distributor')

            const distri = await distriRef.get();

            var distriname = ""

            distri.forEach(result =>{
                if(result.id == dataOrderAfter.acceptedBy){
                    distriname += result.data().name+" "+result.data().lastname
                }
            })

            // Notification content
            const payload = {
                notification: {
                    title: `Solicitud Aceptada`,
                    body: `Su solicitud de entrega de cilindro fue aceptado por ${distriname}`,
                    icon: 'https://goo.gl/Fz9nrQ'
                }
            }

            const devicesRef = db.collection('devices').where("userId","==",dataOrderAfter.userUid)

            const devices = await devicesRef.get();

            const tokens = [];

            // send a notification to each device token
            devices.forEach(result => {
                const token = result.data().token;
                tokens.push(token)
            })

            return admin.messaging().sendToDevice(tokens, payload)
        }else{
            console.log(JSON.stringify({userState: dataOrderAfter.state }))
            if(dataOrderAfter.state == "Cancelado"){

                const db = admin.firestore()
                const distribuitorRef = db.collection('distributor').where('zone', "==",dataOrderAfter.zone)

                const devicesRef = db.collection('devices')
        
                const devices = await devicesRef.get();
                const distribuitor = await distribuitorRef.get();
        
                const tokens = [];
        
                const payload = {
                    notification: {
                        title: `Orden Cancelada`,
                        body: `Usuario canceló su peedido`
                    },
                    data:{
                        state: "cancel",
                        notid: dataOrderAfter.id.toString()
                    }
                }

                console.log(payload)

                // send a notification to each device token
                distribuitor.forEach(distr => {
                    devices.forEach(dev =>{
                        if(distr.id == dev.data().userId){
                            const token = dev.data().token;
                            tokens.push(token)
                        }
                    })
                })
        
                return admin.messaging().sendToDevice(tokens, payload)
            }
            return null
        }
})

exports.newOrderGasNorth = functions.firestore
    .document('orderGas/Norte/pedidos/{pedidoID}')
    .onCreate(async event =>{
        const dataOrder = event.data();
        console.log(JSON.stringify(dataOrder))

        // ref to the device collection for the user
        const db = admin.firestore()
        //db.settings({ timestampsInSnapshots: true })

        const userRef = db.collection('users')

        const user = await userRef.get();

        var username = ""

        user.forEach(result =>{
            if(result.id == dataOrder.userUid){
                username += (result.data().lastname != "")? result.data().name+" "+result.data().lastname : result.data().name
            }
        })

        console.log(username)

        let idNot:any = dataOrder.id.toString()
        // Notification content
        const payload = {
            notification: {
                title: `Nuevo Pedido de Gas en Sector ${dataOrder.zone}`,
                body: `Tienes un nuevo Pedido de ${username}`,
                icon: 'https://goo.gl/Fz9nrQ'
            },
            data:{
                id: event.id,
                zona: "Norte",
                notid: idNot
            }
        }

        console.log(payload)
        const distribuitorRef = db.collection('distributor').where('zone', "==",dataOrder.zone)

        const devicesRef = db.collection('devices')

        const devices = await devicesRef.get();
        const distribuitor = await distribuitorRef.get();

        const tokens = [];

        // send a notification to each device token
        distribuitor.forEach(distr => {
            devices.forEach(dev =>{
                if(distr.id == dev.data().userId){
                    const token = dev.data().token;
                    tokens.push(token)
                }
            })
        })

        return admin.messaging().sendToDevice(tokens, payload)
});


// funciones de pedidos al sur
exports.orderIsAcceptedSouth = functions.firestore
    .document('orderGas/Sur/pedidos/{pedidoID}')
    .onUpdate(async event =>{
        const dataOrderbefore = event.before.data();
        const dataOrderAfter = event.after.data();

        console.log(JSON.stringify(dataOrderbefore))
        console.log(JSON.stringify(dataOrderAfter))

        if(dataOrderAfter.state == "Aceptado"){
            const db = admin.firestore()

            const distriRef = db.collection('distributor')

            const distri = await distriRef.get();

            var distriname = ""

            distri.forEach(result =>{
                if(result.id == dataOrderAfter.acceptedBy){
                    distriname += result.data().name+" "+result.data().lastname
                }
            })

            // Notification content
            const payload = {
                notification: {
                    title: `Solicitud Aceptada`,
                    body: `Su solicitud de entrega de cilindro fue aceptado por ${distriname}`,
                    icon: 'https://goo.gl/Fz9nrQ'
                }
            }

            const devicesRef = db.collection('devices').where("userId","==",dataOrderAfter.userUid)

            const devices = await devicesRef.get();

            const tokens = [];

            // send a notification to each device token
            devices.forEach(result => {
                const token = result.data().token;
                tokens.push(token)
            })

            return admin.messaging().sendToDevice(tokens, payload)
        }else{
            console.log(JSON.stringify({userState: dataOrderAfter.state }))
            if(dataOrderAfter.state == "Cancelado"){

                const db = admin.firestore()
                const distribuitorRef = db.collection('distributor').where('zone', "==",dataOrderAfter.zone)

                const devicesRef = db.collection('devices')
        
                const devices = await devicesRef.get();
                const distribuitor = await distribuitorRef.get();
        
                const tokens = [];
        
                const payload = {
                    notification: {
                        title: `Orden Cancelada`,
                        body: `Usuario canceló su peedido`
                    },
                    data:{
                        state: "cancel",
                        notid: dataOrderAfter.id.toString()
                    }
                }

                console.log(payload)

                // send a notification to each device token
                distribuitor.forEach(distr => {
                    devices.forEach(dev =>{
                        if(distr.id == dev.data().userId){
                            const token = dev.data().token;
                            tokens.push(token)
                        }
                    })
                })
        
                return admin.messaging().sendToDevice(tokens, payload)
            }
            return null
        }
})

exports.newOrderGasSouth = functions.firestore
    .document('orderGas/Sur/pedidos/{pedidoID}')
    .onCreate(async event =>{
        const dataOrder = event.data();
        console.log(JSON.stringify(dataOrder))

        // ref to the device collection for the user
        const db = admin.firestore()
        //db.settings({ timestampsInSnapshots: true })

        const userRef = db.collection('users')

        const user = await userRef.get();

        var username = ""

        user.forEach(result =>{
            if(result.id == dataOrder.userUid){
                username += (result.data().lastname != "")? result.data().name+" "+result.data().lastname : result.data().name
            }
        })

        console.log(username)

        let idNot:any = dataOrder.id.toString()
        // Notification content
        const payload = {
            notification: {
                title: `Nuevo Pedido de Gas en Sector ${dataOrder.zone}`,
                body: `Tienes un nuevo Pedido de ${username}`,
                icon: 'https://goo.gl/Fz9nrQ'
            },
            data:{
                id: event.id,
                zona: "Sur",
                notid: idNot
            }
        }

        
        const distribuitorRef = db.collection('distributor').where('zone', "==",dataOrder.zone)

        const devicesRef = db.collection('devices')

        const devices = await devicesRef.get();
        const distribuitor = await distribuitorRef.get();

        const tokens = [];

        // send a notification to each device token
        distribuitor.forEach(distr => {
            devices.forEach(dev =>{
                if(distr.id == dev.data().userId){
                    const token = dev.data().token;
                    tokens.push(token)
                }
            })
        })

        return admin.messaging().sendToDevice(tokens, payload)
});


// funciones de pedidos al centro
exports.orderIsAcceptedCenter = functions.firestore
    .document('orderGas/Centro/pedidos/{pedidoID}')
    .onUpdate(async event =>{
        const dataOrderbefore = event.before.data();
        const dataOrderAfter = event.after.data();

        console.log(JSON.stringify(dataOrderbefore))
        console.log(JSON.stringify(dataOrderAfter))

        if(dataOrderAfter.state == "Aceptado"){
            const db = admin.firestore()

            const distriRef = db.collection('distributor')

            const distri = await distriRef.get();

            var distriname = ""

            distri.forEach(result =>{
                if(result.id == dataOrderAfter.acceptedBy){
                    distriname += result.data().name+" "+result.data().lastname
                }
            })

            // Notification content
            const payload = {
                notification: {
                    title: `Solicitud Aceptada`,
                    body: `Su solicitud de entrega de cilindro fue aceptado por ${distriname}`,
                    icon: 'https://goo.gl/Fz9nrQ'
                }
            }

            const devicesRef = db.collection('devices').where("userId","==",dataOrderAfter.userUid)

            const devices = await devicesRef.get();

            const tokens = [];

            // send a notification to each device token
            devices.forEach(result => {
                const token = result.data().token;
                tokens.push(token)
            })

            return admin.messaging().sendToDevice(tokens, payload)
        }else{
            console.log(JSON.stringify({userState: dataOrderAfter.state }))
            if(dataOrderAfter.state == "Cancelado"){

                const db = admin.firestore()
                const distribuitorRef = db.collection('distributor').where('zone', "==",dataOrderAfter.zone)

                const devicesRef = db.collection('devices')
        
                const devices = await devicesRef.get();
                const distribuitor = await distribuitorRef.get();
        
                const tokens = [];
        
                const payload = {
                    notification: {
                        title: `Orden Cancelada`,
                        body: `Usuario canceló su peedido`
                    },
                    data:{
                        state: "cancel",
                        notid: dataOrderAfter.id.toString()
                    }
                }

                console.log(payload)

                // send a notification to each device token
                distribuitor.forEach(distr => {
                    devices.forEach(dev =>{
                        if(distr.id == dev.data().userId){
                            const token = dev.data().token;
                            tokens.push(token)
                        }
                    })
                })
        
                return admin.messaging().sendToDevice(tokens, payload)
            }
            return null
        }
})

exports.newOrderGasCenter = functions.firestore
    .document('orderGas/Centro/pedidos/{pedidoID}')
    .onCreate(async event =>{
        const dataOrder = event.data();
        console.log(JSON.stringify(dataOrder))

        // ref to the device collection for the user
        const db = admin.firestore()
        //db.settings({ timestampsInSnapshots: true })

        const userRef = db.collection('users')

        const user = await userRef.get();

        var username = ""

        user.forEach(result =>{
            if(result.id == dataOrder.userUid){
                username += (result.data().lastname != "")? result.data().name+" "+result.data().lastname : result.data().name
            }
        })

        console.log(username)

        let idNot:any = dataOrder.id.toString()
        // Notification content
        const payload = {
            notification: {
                title: `Nuevo Pedido de Gas en Sector ${dataOrder.zone}`,
                body: `Tienes un nuevo Pedido de ${username}`,
                icon: 'https://goo.gl/Fz9nrQ'
            },
            data:{
                id: event.id,
                zona: "Centro",
                notid: idNot
            }
        }

        
        const distribuitorRef = db.collection('distributor').where('zone', "==",dataOrder.zone)

        const devicesRef = db.collection('devices')

        const devices = await devicesRef.get();
        const distribuitor = await distribuitorRef.get();

        const tokens = [];

        // send a notification to each device token
        distribuitor.forEach(distr => {
            devices.forEach(dev =>{
                if(distr.id == dev.data().userId){
                    const token = dev.data().token;
                    tokens.push(token)
                }
            })
        })

        return admin.messaging().sendToDevice(tokens, payload)
});


