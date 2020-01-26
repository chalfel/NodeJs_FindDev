const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');
/* index, show, store, update, destroy
 index quando quiser exibir uma lista
 show exibir apenas um
 store insere uma novo dado
 update atualiza um dado
 destroy destroi um dado
*/
 module.exports = {
     
    async index(request, response) {

        const devs = await Dev.find();

        return response.json(devs);
    }, 

    async store(request, response) {
        const { github_username, techs, latitude, longitude  } = request.body;
    
        const apiResponse =  await axios.get(`https://api.github.com/users/${github_username}`);
        
        let dev = await Dev.findOne({ github_username });

        if (!dev) {

            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
            console.log(longitude);
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            } 
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })
        
            // Filtras as Conexões que estão há no máximo 10 km de distancia
            // e que o novo dev tenha pelomenos uma das tecnologias filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray
                )
            console.log(sendSocketMessageTo);
            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }

        return response.json(dev);
    }
};