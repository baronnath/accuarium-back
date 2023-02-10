// helpers/accessControl.js

const Role 			= require('../models/role');
const EndPoint 		= require('../models/endPoint');
const Permission 	= require('../models/permission');
const AccessControl = require('accesscontrol');
const defaultLocale	= require('../config/translator')['fallbackLng']['default'][0]

global.ac;

exports.init = async () => {
	ac = new AccessControl();

	const grantList = [
		'createOwn',
		'readOwn',
		'updateOwn',
		'deleteOwn',
		'createAny',
		'readAny',
		'updateAny',
		'deleteAny'
	]

	const permissions = await Permission.find().populate('role').populate('endPoint');
	for await (permission of permissions) {

		grantList.forEach( async (grant) => {

			let attributes = ['*'];
			if(permission.excludes[grant]){
				let exclude = permission.excludes[grant].split(',');
  			exclude.forEach(attr => {
  				attributes.push('!'+attr);
  			});
  		}

			if(permission.grants[grant])
				ac.grant(permission.role.name[defaultLocale])[grant](permission.endPoint.name[defaultLocale], attributes);

		});

	}

	return ac;
};

exports.regen = this.init;