const alexaSkillKit = require('alexa-skill-kit');
const AlexaMessageBuilder = require('alexa-message-builder');
const request = require('request-promise');
const imgur = require('imgur');
const secrets = require('./secrets');

imgur.setClientId(secrets.imgur.client_id);
imgur.setAPIUrl('https://api.imgur.com/3/');

exports.handler = function(event, context) {
  alexaSkillKit(event, context, parsedMessage => {
    let config = {
      uri: 'https://themtn.top/api',
      simple: false,
      json: true
    }

    let verdict;

    return request.get(config)
      .catch(err => {
        console.log('caught error', err.stack)
      })
      .then(result => {
        verdict = result.result ? 'The mountain is out!' : 'The mountain is not out.';

        return imgur.uploadUrl(result.image);
      })
      .then(result => {
        console.log(result);
        return new AlexaMessageBuilder()
          .addText(verdict)
          .addStandardCard('Mt.Rainier', verdict, {
            smallImageUrl: result.data.link.replace('http://', 'https://'),
            largeImageUrl: result.data.link.replace('http://', 'https://')
          })
          .get()
      });
  })
}