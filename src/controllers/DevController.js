const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
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
        
        }

        return response.json(dev);
    }
};