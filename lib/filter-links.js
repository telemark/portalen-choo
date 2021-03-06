const wildcard = require('wildcard')
const makeUnique = require('tfk-unique-array')
const links = require('../data/links.json')

function validateIp (options) {
  const { link, myIp } = options
  const include = link.includeIps && Array.isArray(link.includeIps) ? link.includeIps.filter(ip => wildcard(ip, myIp)).length > 0 : true
  const exclude = link.excludeIps && Array.isArray(link.excludeIps) ? link.excludeIps.filter(ip => wildcard(ip, myIp)).length !== 0 : false

  return include === true && exclude === false
}

function ipFilter (options) {
  const links = options.links.map(link => Object.assign(link, { isValid: validateIp({ link: link, myIp: options.myIp }) }))
  return links.filter(link => link.isValid)
}

module.exports = data => {
  let roles = data ? data.roles : []
  let myIp = data ? data.myIp : false
  let myLinks = []

  roles = Array.isArray(roles) ? roles : roles.split('|')

  roles.forEach(item => {
    if (links.hasOwnProperty(item)) {
      myLinks = myLinks.concat(links[item])
    }
  })

  return makeUnique(myIp ? ipFilter({ links: myLinks, myIp: myIp }) : myLinks)
}
